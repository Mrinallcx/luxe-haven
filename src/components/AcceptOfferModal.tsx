import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AcceptOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  price: number;
  token: string;
  expiresAt: number;
  fromAddress?: string;
}

const formatTimeRemaining = (expiresAt: number) => {
  const now = Date.now();
  const diff = expiresAt - now;
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  
  if (days > 0) return `in ${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `in ${hours}h ${minutes}m ${seconds}s`;
  return `in ${minutes}m ${seconds}s`;
};

const AcceptOfferModal = ({
  open,
  onOpenChange,
  price,
  token,
  expiresAt,
  fromAddress = "0x9c7...D4FB5",
}: AcceptOfferModalProps) => {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [, setTick] = useState(0);

  // Live countdown
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const handleAccept = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  const handleClose = () => {
    setStep("form");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-cream border-champagne/30 overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-2xl font-serif text-charcoal">Accept Offer</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center hover:bg-charcoal/20 transition-colors"
          >
            <X className="w-4 h-4 text-charcoal" />
          </button>
        </div>

        {step === "form" && (
          <div className="px-6 pb-6 space-y-6">
            {/* Offer Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="text-charcoal font-medium">{price.toLocaleString()} {token}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="text-gold font-medium">{fromAddress}</span>
              </div>
              <div className="h-px bg-charcoal/10" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expiration</span>
                <span className="text-charcoal font-medium font-mono">{formatTimeRemaining(expiresAt)}</span>
              </div>
            </div>

            {/* Accept Button */}
            <Button
              onClick={handleAccept}
              className="w-full rounded-full bg-gold hover:bg-gold/90 text-charcoal font-medium py-6"
            >
              Accept Offer
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="px-6 pb-6 py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-charcoal font-medium">Processing acceptance...</p>
            <p className="text-sm text-muted-foreground">Please wait while we confirm your transaction</p>
          </div>
        )}

        {step === "success" && (
          <div className="px-6 pb-6 py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-charcoal">Offer Accepted!</h3>
            <p className="text-sm text-muted-foreground text-center">
              The transaction has been initiated. You will receive {price.toLocaleString()} {token} once confirmed.
            </p>
            <Button
              onClick={handleClose}
              className="rounded-full bg-gold hover:bg-gold/90 text-charcoal font-medium px-8"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AcceptOfferModal;
