import { useState, useCallback } from "react";
import { useSendTransaction, usePublicClient, useAccount, useChainId } from "wagmi";
import { parseUnits, encodeFunctionData, erc20Abi } from "viem";
import { buyUnmintedFixedPrice, BuyUserOrder } from "@/lib/market-api";
import { 
  getTokenAddress as getTokenAddressFromConfig, 
  getEscrowAddress as getEscrowAddressFromConfig,
  getTokenDecimals,
  requiresApproval as checkRequiresApproval
} from "@/lib/contracts";
import { toast } from "sonner";

export type PurchaseStatus = 
  | "idle"
  | "preparing"            // Calling backend API
  | "checking_allowance"   // Checking token allowance
  | "awaiting_approval"    // Waiting for user to approve token spend
  | "confirming_approval"  // Waiting for approval tx confirmation
  | "awaiting_signature"   // Waiting for purchase tx signature
  | "confirming"           // Transaction submitted, waiting for blockchain confirmation
  | "success"              // Transaction confirmed on blockchain
  | "error";

interface UsePurchaseReturn {
  purchase: (
    assetId: number,
    primaryAmount: number,
    primaryCoin: string,
    buyerAddress: string,
    spenderAddress?: string, // Marketplace contract address
    secondaryCoin?: string,
    secondaryAmount?: number
  ) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  status: PurchaseStatus;
  txHash: string | null;
  error: string | null;
  reset: () => void;
}

export function usePurchase(): UsePurchaseReturn {
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  // Get token contract address for current chain
  const getTokenAddress = useCallback((coin: string): `0x${string}` | null => {
    return getTokenAddressFromConfig(chainId, coin);
  }, [chainId]);

  // Get escrow contract address for current chain
  const getEscrowAddress = useCallback((): `0x${string}` | null => {
    return getEscrowAddressFromConfig(chainId);
  }, [chainId]);

  // Check current allowance
  const checkAllowance = useCallback(async (
    tokenAddress: `0x${string}`,
    ownerAddress: `0x${string}`,
    spenderAddr: `0x${string}`
  ): Promise<bigint> => {
    if (!publicClient) return BigInt(0);
    
    try {
      // Encode the allowance call
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "allowance",
        args: [ownerAddress, spenderAddr],
      });
      
      const result = await publicClient.call({
        to: tokenAddress,
        data,
      });
      
      if (result.data) {
        // Decode the result (allowance returns uint256)
        return BigInt(result.data);
      }
      return BigInt(0);
    } catch (err) {
      console.error("Error checking allowance:", err);
      return BigInt(0);
    }
  }, [publicClient]);

  // Approve token spend
  const approveToken = useCallback(async (
    tokenAddress: `0x${string}`,
    spenderAddr: `0x${string}`,
  ): Promise<`0x${string}` | null> => {
    try {
      // Use max uint256 for unlimited approval (common practice)
      const approvalAmount = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      
      // Encode the approve call
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddr, approvalAmount],
      });
      
      const hash = await sendTransactionAsync({
        to: tokenAddress,
        data,
      });
      
      return hash;
    } catch (err) {
      console.error("Error approving token:", err);
      return null;
    }
  }, [sendTransactionAsync]);

  const purchase = useCallback(
    async (
      assetId: number,
      primaryAmount: number,
      primaryCoin: string,
      buyerAddress: string,
      spenderAddress?: string,
      secondaryCoin?: string,
      secondaryAmount?: number
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      try {
        reset();
        setStatus("preparing");

        const coinUpper = primaryCoin.toUpperCase();

        // ============================================================
        // STEP 1: CHECK AND REQUEST TOKEN APPROVAL FIRST (before backend call)
        // This must happen BEFORE calling the backend API because the backend
        // will check allowance during gas estimation
        // ============================================================
        if (checkRequiresApproval(coinUpper) && address) {
          setStatus("checking_allowance");
          
          const tokenAddress = getTokenAddress(coinUpper);
          const escrowAddress = getEscrowAddress();
          
          if (tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000" && escrowAddress && escrowAddress !== "0x0000000000000000000000000000000000000000") {
            const decimals = getTokenDecimals(coinUpper);
            const requiredAmount = parseUnits(primaryAmount.toString(), decimals);
            
            const currentAllowance = await checkAllowance(
              tokenAddress,
              address as `0x${string}`,
              escrowAddress
            );

            console.log("Allowance check (before API call):", {
              tokenAddress,
              escrowAddress,
              requiredAmount: requiredAmount.toString(),
              currentAllowance: currentAllowance.toString(),
              needsApproval: currentAllowance < requiredAmount,
            });

            if (currentAllowance < requiredAmount) {
              // Need to approve token spend to Escrow contract FIRST
              setStatus("awaiting_approval");
              toast.info(`Please approve ${coinUpper} token spending in your wallet`);

              const approvalHash = await approveToken(
                tokenAddress,
                escrowAddress
              );

              if (!approvalHash) {
                const errorMsg = "Token approval was rejected or failed";
                setError(errorMsg);
                setStatus("error");
                toast.error("Approval failed", { description: errorMsg });
                return { success: false, error: errorMsg };
              }

              // Wait for approval confirmation
              setStatus("confirming_approval");
              const approvalToastId = toast.loading(`Waiting for ${coinUpper} approval confirmation...`);

              if (publicClient) {
                try {
                  const approvalReceipt = await publicClient.waitForTransactionReceipt({
                    hash: approvalHash,
                    confirmations: 1,
                  });

                  toast.dismiss(approvalToastId);

                  if (approvalReceipt.status !== "success") {
                    const errorMsg = "Token approval failed on blockchain";
                    setError(errorMsg);
                    setStatus("error");
                    toast.error("Approval failed", { description: errorMsg });
                    return { success: false, error: errorMsg };
                  }

                  toast.success(`${coinUpper} approval confirmed! Preparing purchase...`);
                } catch (approvalReceiptError) {
                  toast.dismiss(approvalToastId);
                  // Continue anyway - approval might have succeeded
                  toast.info("Approval submitted, proceeding with purchase...");
                }
              }
            } else {
              console.log("Sufficient allowance already exists, proceeding to purchase...");
            }
          } else {
            console.warn(`Token address or Escrow address not found for ${coinUpper} on chain ${chainId}`);
          }
        }

        // ============================================================
        // STEP 2: NOW call backend API (after approval is confirmed)
        // ============================================================
        setStatus("preparing");

        const userOrder: BuyUserOrder = {
          assetId: Number(assetId),
          primaryAmount: Number(primaryAmount),
          primaryCoin: coinUpper,
          secondaryAmount: secondaryAmount ? Number(secondaryAmount) : 0,
          secondaryCoin: secondaryCoin ? secondaryCoin.toUpperCase() : "",
          buyer: buyerAddress,
        };

        const response = await buyUnmintedFixedPrice({ userOrder });

        if (response.error || !response.data) {
          const errorMsg = response.error || "Failed to prepare purchase";
          setError(errorMsg);
          setStatus("error");
          toast.error("Purchase failed", { description: errorMsg });
          return { success: false, error: errorMsg };
        }

        const { txData, validity, chain } = response.data;

        // Step 3: Check validity
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= validity) {
          const errorMsg = "Transaction validity expired. Please try again.";
          setError(errorMsg);
          setStatus("error");
          toast.error("Purchase failed", { description: errorMsg });
          return { success: false, error: errorMsg };
        }

        // Step 4: Only support Ethereum for now
        if (chain !== "ETHEREUM") {
          const errorMsg = "Only Ethereum chain is supported currently";
          setError(errorMsg);
          setStatus("error");
          toast.error("Purchase failed", { description: errorMsg });
          return { success: false, error: errorMsg };
        }

        // Step 5: Request wallet signature for purchase
        setStatus("awaiting_signature");
        toast.info("Please confirm the purchase transaction in your wallet");

        try {
          // Send the transaction
          const hash = await sendTransactionAsync({
            to: txData.to as `0x${string}`,
            data: txData.data as `0x${string}`,
            gas: txData.gas ? BigInt(txData.gas) : undefined,
            value: txData.value ? BigInt(txData.value) : BigInt(0),
          });

          setTxHash(hash);
          setStatus("confirming");
          
          const toastId = toast.loading("Transaction submitted! Waiting for blockchain confirmation...", {
            duration: Infinity,
          });

          // Step 7: Wait for transaction confirmation
          if (publicClient) {
            try {
              const receipt = await publicClient.waitForTransactionReceipt({
                hash: hash as `0x${string}`,
                confirmations: 1,
              });

              toast.dismiss(toastId);

              if (receipt.status === "success") {
                setStatus("success");
                toast.success("Transaction confirmed!", {
                  description: `Your purchase is complete. Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
                });
                return { success: true, txHash: hash };
              } else {
                setStatus("error");
                setError("Transaction failed on blockchain");
                toast.error("Transaction failed", {
                  description: "The transaction was reverted on the blockchain",
                });
                return { success: false, error: "Transaction reverted", txHash: hash };
              }
            } catch (receiptError) {
              // If we can't get the receipt, still consider it potentially successful
              toast.dismiss(toastId);
              setStatus("success");
              toast.success("Transaction submitted!", {
                description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}. Check your wallet for confirmation.`,
              });
              return { success: true, txHash: hash };
            }
          } else {
            toast.dismiss(toastId);
            setStatus("success");
            toast.success("Transaction submitted!", {
              description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
            });
            return { success: true, txHash: hash };
          }
        } catch (walletError: unknown) {
          const errorMsg = walletError instanceof Error 
            ? walletError.message 
            : "Wallet transaction failed";
          
          // Check if user rejected
          if (errorMsg.includes("rejected") || errorMsg.includes("denied") || errorMsg.includes("User rejected")) {
            setError("Transaction was rejected by user");
            setStatus("error");
            toast.error("Transaction rejected", {
              description: "You rejected the transaction in your wallet",
            });
            return { success: false, error: "Transaction rejected by user" };
          }

          // Check for allowance error (should not happen after our approval flow)
          if (errorMsg.includes("allowance") || errorMsg.includes("Allowance")) {
            setError("Token approval insufficient. Please try again.");
            setStatus("error");
            toast.error("Approval required", {
              description: "Please approve token spending and try again",
            });
            return { success: false, error: "Insufficient token allowance" };
          }

          setError(errorMsg);
          setStatus("error");
          toast.error("Transaction failed", { description: errorMsg });
          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Purchase failed";
        setError(errorMsg);
        setStatus("error");
        toast.error("Purchase failed", { description: errorMsg });
        return { success: false, error: errorMsg };
      }
    },
    [sendTransactionAsync, publicClient, address, reset, getTokenAddress, getEscrowAddress, checkAllowance, approveToken, chainId]
  );

  return {
    purchase,
    status,
    txHash,
    error,
    reset,
  };
}

export default usePurchase;
