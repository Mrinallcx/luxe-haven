import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail, KeyRound } from "lucide-react";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "email" | "otp" | "success";

const SignInModal = ({ open, onOpenChange }: SignInModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("otp");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep("success");
      setTimeout(() => {
        onOpenChange(false);
        navigate("/account");
        // Reset state for next time
        setStep("email");
        setEmail("");
        setOtp("");
      }, 2000);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setStep("email");
      setEmail("");
      setOtp("");
    }
    onOpenChange(isOpen);
  };

  const stepConfig = {
    email: {
      title: "Enter Your Email",
      icon: Mail,
    },
    otp: {
      title: "Verify OTP",
      icon: KeyRound,
    },
    success: {
      title: "Welcome Back!",
      icon: CheckCircle,
    },
  };

  const currentStep = stepConfig[step];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-cream border-champagne/30">
        <DialogHeader className="space-y-4">
          {/* Brand Logo & Tagline */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl tracking-wider text-charcoal">
              MAISON
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              Luxury Precious Metals & Gems
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <currentStep.icon className="h-5 w-5 text-gold" />
            <DialogTitle className="font-display text-lg text-charcoal">
              {currentStep.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-sans text-charcoal">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-champagne/50 focus:border-gold"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-charcoal text-cream hover:bg-charcoal/90"
                >
                  Continue
                </Button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground font-sans">
                    We've sent a 6-digit code to
                  </p>
                  <p className="font-medium text-charcoal font-sans">{email}</p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-champagne/50" />
                      <InputOTPSlot index={1} className="border-champagne/50" />
                      <InputOTPSlot index={2} className="border-champagne/50" />
                      <InputOTPSlot index={3} className="border-champagne/50" />
                      <InputOTPSlot index={4} className="border-champagne/50" />
                      <InputOTPSlot index={5} className="border-champagne/50" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full rounded-full bg-charcoal text-cream hover:bg-charcoal/90 disabled:opacity-50"
                >
                  Verify & Sign In
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-muted-foreground hover:text-charcoal transition-colors font-sans"
                >
                  Use a different email
                </button>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="h-16 w-16 text-gold mx-auto" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-charcoal">
                    Successfully Signed In
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Redirecting you to your account...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 pb-2">
          {["email", "otp", "success"].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full transition-colors ${
                s === step ? "bg-gold" : "bg-champagne/50"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
