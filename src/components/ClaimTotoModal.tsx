import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink, Loader2, Wallet } from "lucide-react";

type Step = "form" | "processing" | "waiting" | "success";

interface ClaimTotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimableAmount: number;
  onClaimComplete?: () => void;
}

const ClaimTotoModal = ({
  open,
  onOpenChange,
  claimableAmount,
  onClaimComplete,
}: ClaimTotoModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const walletAddress = "0x1234...5678"; // Mock wallet address

  const handleClaim = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("waiting");
      setTimeout(() => {
        setStep("success");
        onClaimComplete?.();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-serif font-light text-foreground">
                  Claim TOTO Rewards
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Unclaimed Rewards */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">
                    Unclaimed Rewards
                  </p>
                  <p className="text-2xl font-sans font-medium text-gold">
                    {claimableAmount.toLocaleString()} TOTO
                  </p>
                </div>

                {/* Wallet Address */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">
                    Reward will be credited to
                  </p>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gold" />
                    <code className="text-sm font-mono text-foreground">
                      {walletAddress}
                    </code>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClaim}
                className="w-full rounded-full bg-gold text-charcoal hover:bg-gold/90 tracking-wider uppercase text-xs py-3 h-auto font-medium"
              >
                Claim Rewards
              </Button>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-gold" />
              </motion.div>
              <p className="text-lg font-serif font-light text-foreground">Processing...</p>
              <p className="text-sm text-muted-foreground text-center">
                Initiating reward claim transaction
              </p>
            </motion.div>
          )}

          {step === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center"
              >
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 rounded-full bg-gold/50"
                />
              </motion.div>
              <p className="text-lg font-serif font-light text-foreground">Waiting...</p>
              <p className="text-sm text-muted-foreground text-center">
                Confirming transaction on blockchain
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-green-500" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-lg font-serif font-light text-foreground">
                  Rewards Credited to Your Wallet
                </p>
                <p className="text-2xl font-sans font-medium text-gold">
                  +{claimableAmount.toLocaleString()} TOTO
                </p>
              </div>
              
              <a
                href="https://etherscan.io/tx/0x..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Etherscan
              </a>

              <Button
                onClick={handleClose}
                variant="outline"
                className="rounded-full border-border hover:border-gold hover:text-gold tracking-wider uppercase text-xs px-8"
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimTotoModal;
