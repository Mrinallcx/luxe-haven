import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Loader2, AlertCircle, CheckCircle2, PenTool, Wallet, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Wallet icons
import metamaskIcon from "@/assets/wallet-icons/metamask.svg";
import walletconnectIcon from "@/assets/wallet-icons/walletconnect.svg";
import coinbaseIcon from "@/assets/wallet-icons/coinbase.svg";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Map connector IDs to icons and display names
const walletInfo: Record<string, { name: string; icon: string }> = {
  metaMaskSDK: { name: "MetaMask", icon: metamaskIcon },
  metaMask: { name: "MetaMask", icon: metamaskIcon },
  walletConnect: { name: "WalletConnect", icon: walletconnectIcon },
  coinbaseWalletSDK: { name: "Coinbase Wallet", icon: coinbaseIcon },
};

type ModalStep = "select" | "existing" | "connected" | "signing" | "success" | "error";

const WalletConnectModal = ({ open, onOpenChange }: WalletConnectModalProps) => {
  const { isSignedIn } = useAuth();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { 
    registerWallet, 
    isRegistering, 
    registrationError, 
    walletName,
    fetchBlockchainId,
    blockchainId,
    isAlreadyRegistered,
    isFetchingProfile,
    checkWalletRegistration
  } = useWallet();
  
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [step, setStep] = useState<ModalStep>("select");
  const [isLoadingData, setIsLoadingData] = useState(false);

  // When modal opens, check the state
  useEffect(() => {
    const initializeModal = async () => {
      if (!open) return;
      
      // If wallet is already connected when modal opens
      if (isConnected && address) {
        setIsLoadingData(true);
        
        // Fetch blockchainId and check registration status
        await fetchBlockchainId();
        const isRegistered = await checkWalletRegistration();
        
        setIsLoadingData(false);
        
        if (isRegistered) {
          // Wallet already registered, show success or close
          setStep("success");
          setTimeout(() => {
            onOpenChange(false);
          }, 1500);
        } else {
          // Wallet connected but not registered for this user
          setStep("existing");
        }
      } else {
        setStep("select");
      }
    };

    initializeModal();
  }, [open, isConnected, address, fetchBlockchainId, checkWalletRegistration, onOpenChange]);

  // Handle new wallet connection
  useEffect(() => {
    const handleNewConnection = async () => {
      if (isConnected && address && step === "select" && connectingId) {
        setIsLoadingData(true);
        
        // Fetch blockchainId for the new connection
        await fetchBlockchainId();
        
        setIsLoadingData(false);
        setConnectingId(null);
        setStep("connected");
      }
    };

    handleNewConnection();
  }, [isConnected, address, step, connectingId, fetchBlockchainId]);

  // Reset step when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("select");
        setConnectingId(null);
      }, 200);
    }
  }, [open]);

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setConnectingId(connectorId);
      connect({ connector });
    }
  };

  const handleSignMessage = async () => {
    // First check if wallet is already registered
    const alreadyRegistered = await checkWalletRegistration();
    
    if (alreadyRegistered) {
      // No signing needed - wallet already registered
      setStep("success");
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      return;
    }
    
    // Proceed with signing
    setStep("signing");
    
    const success = await registerWallet();
    
    if (success) {
      setStep("success");
      setTimeout(() => {
      onOpenChange(false);
      }, 1500);
    } else {
      setStep("error");
    }
  };

  const handleDisconnectAndChooseNew = () => {
    wagmiDisconnect();
    setStep("select");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setStep("connected");
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Filter to only show specific wallets and avoid duplicates
  const availableConnectors = connectors.filter((connector) => {
    const id = connector.id.toLowerCase();
    return (
      id.includes("metamask") ||
      id === "walletconnect" ||
      id.includes("coinbase")
    );
  });

  // Remove duplicates by name
  const uniqueConnectors = availableConnectors.reduce((acc, connector) => {
    const info = walletInfo[connector.id] || { name: connector.name, icon: "" };
    const exists = acc.find((c) => {
      const existingInfo = walletInfo[c.id] || { name: c.name };
      return existingInfo.name === info.name;
    });
    if (!exists) {
      acc.push(connector);
    }
    return acc;
  }, [] as typeof availableConnectors);

  // If not signed in, show auth required message
  if (!isSignedIn) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-serif font-light text-xl tracking-wide">
              Connect Wallet
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Connect your wallet to access all features
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500" />
            <p className="text-center text-foreground font-medium">
              Sign In Required
            </p>
            <p className="text-center text-muted-foreground text-sm">
              Please sign in with your email first before connecting your wallet.
            </p>
          </div>

          <Button variant="outline" className="w-full" onClick={handleClose}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Loading state
  if (isLoadingData || isFetchingProfile) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-serif font-light text-xl tracking-wide">
              Connect Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-gold" />
            <p className="text-center text-muted-foreground text-sm">
              Loading account data...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif font-light text-xl tracking-wide">
            {step === "existing" ? "Wallet Detected" :
             step === "connected" ? "Verify Ownership" : 
             step === "signing" ? "Signing Message" :
             step === "success" ? "Wallet Connected" :
             step === "error" ? "Verification Failed" :
             "Connect Wallet"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === "existing" ? "A wallet is already connected from a previous session" :
             step === "connected" ? "Sign a message to verify you own this wallet" :
             step === "signing" ? "Please confirm the signature in your wallet" :
             step === "success" ? "Your wallet has been connected and verified" :
             step === "error" ? "Failed to verify wallet ownership" :
             "Connect your Ethereum wallet to continue"}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Existing Wallet Detected */}
        {step === "existing" && (
          <div className="space-y-6 py-4">
            {/* Connected Wallet Info */}
            <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Previously Connected</p>
                <p className="font-medium text-foreground">{walletName || "Wallet"}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {address ? formatAddress(address) : ""}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              This wallet was connected in a previous session. You can verify it for your current account or connect a different wallet.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="premium"
                className="w-full gap-2"
                onClick={() => setStep("connected")}
              >
                <PenTool className="w-4 h-4" />
                Verify This Wallet
              </Button>
              
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleDisconnectAndChooseNew}
              >
                <RefreshCw className="w-4 h-4" />
                Connect Different Wallet
              </Button>
            </div>
          </div>
        )}

        {/* Step: Wallet Connected - Show Sign Message Button */}
        {step === "connected" && (
          <div className="space-y-6 py-4">
            {/* Connected Wallet Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Connected Wallet</p>
                <p className="font-medium text-foreground">{walletName || "Wallet"}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {address ? formatAddress(address) : ""}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>

            {/* Explanation */}
            <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl space-y-2">
              <div className="flex items-start gap-3">
                <PenTool className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Why sign a message?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Signing proves you own this wallet. This is a free off-chain signature - no gas fees or transactions will be made.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="premium"
                className="w-full gap-2"
                onClick={handleSignMessage}
                disabled={!blockchainId}
              >
                <PenTool className="w-4 h-4" />
                Sign Message to Verify
              </Button>
              
              {!blockchainId && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive text-center">
                    Unable to load account data. Please close this modal and try again.
                  </p>
                </div>
              )}
              
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Step: Signing in Progress */}
        {step === "signing" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="relative">
              <PenTool className="w-12 h-12 text-gold" />
              {isRegistering && (
                <Loader2 className="w-6 h-6 animate-spin text-gold absolute -bottom-1 -right-1" />
              )}
            </div>
            <p className="text-center text-foreground font-medium">
              Waiting for Signature
            </p>
            <p className="text-center text-muted-foreground text-sm">
              Please check your wallet and approve the signature request.
            </p>
            <div className="w-full p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                This is a free signature. No transaction will be sent.
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-center text-foreground font-medium">
              {isAlreadyRegistered ? "Wallet Already Verified!" : "Wallet Verified!"}
            </p>
            <p className="text-center text-muted-foreground text-sm">
              Your wallet has been successfully connected.
            </p>
          </div>
        )}

        {/* Step: Error */}
        {step === "error" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-center text-foreground font-medium">
              Verification Failed
            </p>
            <p className="text-center text-muted-foreground text-sm">
              {registrationError || "Failed to verify wallet ownership. Please try again."}
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="premium" className="flex-1" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
        </div>
        )}

        {/* Step: Wallet Selection */}
        {step === "select" && (
        <div className="space-y-3 mt-4">
            {uniqueConnectors.map((connector) => {
              const info = walletInfo[connector.id] || {
                name: connector.name,
                icon: "",
              };
              const isConnecting = connectingId === connector.id && isPending;

              return (
            <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                    isConnecting
                  ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/50 hover:bg-muted/50",
                    isPending && !isConnecting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {info.icon ? (
                    <img
                      src={info.icon}
                      alt={info.name}
                      className="w-8 h-8 rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                      {info.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium tracking-wide flex-1 text-left">
                    {info.name}
                  </span>
                  {isConnecting && (
                    <Loader2 className="w-5 h-5 animate-spin text-gold" />
              )}
            </button>
              );
            })}

            {/* Connection Error Message */}
            {connectError && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">
                  {connectError.message.includes("rejected")
                    ? "Connection rejected. Please try again."
                    : "Failed to connect. Please try again."}
                </p>
        </div>
            )}

        <Button
              variant="outline"
          className="w-full mt-4"
              onClick={handleClose}
              disabled={isPending}
        >
              Cancel
        </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
