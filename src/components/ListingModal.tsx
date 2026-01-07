import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  onListingComplete?: () => void;
}

type Step = "form" | "processing" | "waiting" | "success";

const TOKENS = ["LCX", "USDT", "USDC", "wETH", "ADA"];
const DURATIONS = [
  { value: "1", label: "1 Day" },
  { value: "7", label: "7 Days" },
  { value: "15", label: "15 Days" },
  { value: "30", label: "30 Days" },
];
const DISCOUNTS = ["None", "10%", "15%", "20%", "30%"];

const ListingModal = ({
  open,
  onOpenChange,
  productName = "Diamond",
  onListingComplete,
}: ListingModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const [saleType, setSaleType] = useState<string>("fixed");
  const [price, setPrice] = useState<string>("");
  const [sellToken, setSellToken] = useState<string>("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [discount, setDiscount] = useState<string>("None");

  const handleCompleteListing = () => {
    setStep("processing");
    
    // Simulate processing stages
    setTimeout(() => {
      setStep("waiting");
    }, 1500);
    
    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

  const handleClose = () => {
    if (step === "success") {
      onListingComplete?.();
    }
    onOpenChange(false);
    // Reset after close
    setTimeout(() => {
      setStep("form");
      setSaleType("fixed");
      setPrice("");
      setSellToken("");
      setSelectedTokens([]);
      setDuration("");
      setDiscount("None");
    }, 300);
  };

  const toggleToken = (token: string) => {
    setSelectedTokens((prev) =>
      prev.includes(token)
        ? prev.filter((t) => t !== token)
        : [...prev, token]
    );
  };

  const isFormValid = price && sellToken && selectedTokens.length > 0 && duration;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-border">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="font-display text-2xl text-foreground">List for Sale</h2>
                <p className="text-muted-foreground text-sm font-sans">
                  {productName}
                </p>
              </div>

              {/* Sale Type Dropdown */}
              <div className="space-y-2">
                <Label className="text-foreground font-sans">Sale Type</Label>
                <Select value={saleType} onValueChange={setSaleType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sale type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="fixed">Fixed Sale</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price with Token Selector */}
              <div className="space-y-2">
                <Label className="text-foreground font-sans">
                  {saleType === "auction" ? "Minimum Bid Price" : "Price"}
                </Label>
                <div className="flex gap-2">
                  <Select value={sellToken} onValueChange={setSellToken}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Token" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      {TOKENS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Token Selection - Multi-select */}
              <div className="space-y-2">
                <Label className="text-foreground font-sans">Accepted Tokens</Label>
                <div className="flex flex-wrap gap-2">
                  {TOKENS.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={selectedTokens.includes(t) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleToken(t)}
                      className="rounded-full"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-foreground font-sans">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    {DURATIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TOTO Discount */}
              <div className="space-y-2">
                <Label className="text-foreground font-sans">Discount on $TOTO</Label>
                <div className="flex gap-2">
                  {DISCOUNTS.map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={discount === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDiscount(d)}
                      className="flex-1 rounded-full"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Complete Listing Button */}
              <Button
                onClick={handleCompleteListing}
                disabled={!isFormValid}
                className="w-full rounded-full"
                size="lg"
              >
                Complete Listing
              </Button>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-12 flex flex-col items-center justify-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-16 h-16 text-gold" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl text-foreground">Processing</h3>
                <p className="text-muted-foreground text-sm font-sans">
                  Preparing your listing...
                </p>
              </div>
            </motion.div>
          )}

          {step === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-12 flex flex-col items-center justify-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-gold/40" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl text-foreground">Waiting</h3>
                <p className="text-muted-foreground text-sm font-sans">
                  Confirming on blockchain...
                </p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-12 flex flex-col items-center justify-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl text-foreground">Successfully Listed!</h3>
                <p className="text-muted-foreground text-sm font-sans">
                  Your {productName} is now live on the marketplace.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="rounded-full px-8"
                size="lg"
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ListingModal;
