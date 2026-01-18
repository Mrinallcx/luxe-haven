import { useState, useCallback } from "react";
import { useSendTransaction, usePublicClient } from "wagmi";
import { buyUnmintedFixedPrice, BuyUserOrder } from "@/lib/market-api";
import { toast } from "sonner";

export type PurchaseStatus = 
  | "idle"
  | "preparing"           // Calling backend API
  | "awaiting_signature"  // Waiting for wallet signature
  | "confirming"          // Transaction submitted, waiting for blockchain confirmation
  | "success"             // Transaction confirmed on blockchain
  | "error";

interface UsePurchaseReturn {
  purchase: (
    assetId: number,
    primaryAmount: number,
    primaryCoin: string,
    buyerAddress: string,
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

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  const purchase = useCallback(
    async (
      assetId: number,
      primaryAmount: number,
      primaryCoin: string,
      buyerAddress: string,
      secondaryCoin?: string,
      secondaryAmount?: number
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      try {
        reset();
        setStatus("preparing");

        // Step 1: Prepare the order
        const userOrder: BuyUserOrder = {
          assetId: Number(assetId),
          primaryAmount: Number(primaryAmount),
          primaryCoin: primaryCoin.toUpperCase(),
          secondaryAmount: secondaryAmount ? Number(secondaryAmount) : 0,
          secondaryCoin: secondaryCoin ? secondaryCoin.toUpperCase() : "",
          buyer: buyerAddress,
        };

        // Step 2: Call backend API to get transaction data
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

        // Step 5: Request wallet signature
        setStatus("awaiting_signature");
        toast.info("Please confirm the transaction in your wallet");

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

          // Step 6: Wait for transaction confirmation
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
              // since the transaction was submitted
              toast.dismiss(toastId);
              setStatus("success");
              toast.success("Transaction submitted!", {
                description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}. Check your wallet for confirmation.`,
              });
              return { success: true, txHash: hash };
            }
          } else {
            // No public client available, just mark as success after submission
            toast.dismiss(toastId);
            setStatus("success");
            toast.success("Transaction submitted!", {
              description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
            });
            return { success: true, txHash: hash };
          }
        } catch (walletError: unknown) {
          // User rejected or wallet error
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
    [sendTransactionAsync, publicClient, reset]
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
