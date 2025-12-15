import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlaceBidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  minimumBid?: number;
  increment?: number;
  currency?: string;
}

type Step = "form" | "processing" | "waiting" | "success";

const PlaceBidModal = ({
  open,
  onOpenChange,
  productName = "Asset",
  minimumBid = 100,
  increment = 1000,
  currency = "LCX",
}: PlaceBidModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const [multiplier, setMultiplier] = useState(1);
  
  const bidAmount = minimumBid + (increment * multiplier);
  const serviceCharge = bidAmount * 0.001; // 0.1% service charge

  const handlePlaceBid = () => {
    setStep("processing");
    setTimeout(() => setStep("waiting"), 1500);
    setTimeout(() => setStep("success"), 3500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep("form"), 300);
    setMultiplier(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-charcoal border-border/50 p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="font-serif text-xl text-cream mb-1">Place Your Bid</h2>
                <p className="text-sm text-muted-foreground">{productName}</p>
              </div>

              {/* Price Calculator */}
              <div className="mb-6">
                <p className="text-sm text-cream mb-3">Price</p>
                <div className="flex items-center gap-2 justify-center">
                  <span className="px-4 py-2.5 bg-muted/30 text-cream rounded-lg font-sans font-medium">
                    {minimumBid.toLocaleString()}
                  </span>
                  <span className="text-cream">+</span>
                  <span className="px-4 py-2.5 bg-muted/30 text-cream rounded-lg font-sans font-medium">
                    {increment.toLocaleString()}
                  </span>
                  <span className="text-cream">×</span>
                  <Input
                    type="number"
                    min={1}
                    value={multiplier}
                    onChange={(e) => setMultiplier(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center bg-charcoal border-gold/50 text-cream font-sans font-medium focus:border-gold"
                  />
                  <span className="px-3 py-2.5 bg-muted/30 text-cream rounded-lg text-sm">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Bid Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Minimum bidding</span>
                  <span className="text-cream font-sans font-medium">
                    {minimumBid.toLocaleString()} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Must bid in increment of</span>
                  <span className="text-cream font-sans font-medium">
                    {increment.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Calculated Amounts */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Your bid amount</span>
                  <span className="text-cream font-sans font-medium text-lg">
                    {bidAmount.toLocaleString()} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground text-sm">Service charge</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-background border-border">
                          <p className="text-sm">0.1% service fee on winning bids</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-cream font-sans font-medium">
                    {serviceCharge.toFixed(1)} {currency}
                  </span>
                </div>
              </div>

              {/* Place Bid Button */}
              <Button
                onClick={handlePlaceBid}
                className="w-full rounded-full bg-gold hover:bg-gold/90 text-charcoal font-medium py-6"
              >
                Place bid
              </Button>

              {/* Warning */}
              <p className="text-center text-gold/80 text-sm mt-4">
                This action can not be undone
              </p>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <Loader2 className="w-12 h-12 text-gold" />
              </motion.div>
              <h3 className="font-serif text-xl text-cream mb-2">Processing</h3>
              <p className="text-sm text-muted-foreground text-center">
                Submitting your bid...
              </p>
            </motion.div>
          )}

          {step === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gold/30" />
                </div>
              </motion.div>
              <h3 className="font-serif text-xl text-cream mb-2">Confirming</h3>
              <p className="text-sm text-muted-foreground text-center">
                Waiting for blockchain confirmation...
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-6"
              >
                <Check className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="font-serif text-xl text-cream mb-2">Bid Placed!</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">
                Your bid of {bidAmount.toLocaleString()} {currency} has been placed
              </p>
              <p className="text-gold font-sans font-medium text-lg mb-6">
                {productName}
              </p>
              <Button
                onClick={handleClose}
                variant="outline"
                className="rounded-full border-cream/30 text-cream hover:bg-cream/10"
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

export default PlaceBidModal;
