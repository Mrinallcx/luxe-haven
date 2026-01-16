import { useState, useEffect } from "react";
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
import { CheckCircle, Mail, KeyRound, Loader2, AlertCircle } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/auth-api";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn?: (user?: { emailId: string }) => void;
}

type Step = "email" | "otp" | "success";

const SignInModal = ({ open, onOpenChange, onSignIn }: SignInModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpValidTill, setOtpValidTill] = useState<number | null>(null);
  const [otpBlockedTill, setOtpBlockedTill] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Countdown timer for OTP validity
  useEffect(() => {
    if (!otpValidTill) return;
    
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((otpValidTill - now) / 1000));
      setCountdown(remaining);
      
      if (remaining === 0) {
        setError("OTP has expired. Please request a new one.");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [otpValidTill]);

  // Countdown timer for resend availability
  useEffect(() => {
    if (!otpBlockedTill) return;
    
    const updateResendCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((otpBlockedTill - now) / 1000));
      setResendCountdown(remaining);
    };

    updateResendCountdown();
    const interval = setInterval(updateResendCountdown, 1000);
    return () => clearInterval(interval);
  }, [otpBlockedTill]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    const response = await requestOtp(email);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    if (response.data) {
      setOtpValidTill(response.data.otpValidTill);
      setOtpBlockedTill(response.data.otpGenerationBlockedTill);
      setStep("otp");
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;

    setIsLoading(true);
    setError(null);
    setOtp("");

    const response = await requestOtp(email);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    if (response.data) {
      setOtpValidTill(response.data.otpValidTill);
      setOtpBlockedTill(response.data.otpGenerationBlockedTill);
      setError(null);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setError(null);

    const response = await verifyOtp(email, otp);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    if (response.data) {
      // Store token if returned
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      setStep("success");
      setTimeout(() => {
        onOpenChange(false);
        onSignIn?.({ emailId: email });
        navigate("/account");
        // Reset state for next time
        resetState();
      }, 2000);
    }
  };

  const resetState = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setError(null);
    setOtpValidTill(null);
    setOtpBlockedTill(null);
    setCountdown(0);
    setResendCountdown(0);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="bg-background border-champagne/50 focus:border-gold"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full rounded-full bg-charcoal text-cream hover:bg-charcoal/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue"
                  )}
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
                  
                  {/* OTP Validity Countdown */}
                  {countdown > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Code expires in{" "}
                      <span className="font-medium text-gold">
                        {formatTime(countdown)}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError(null);
                    }}
                    disabled={isLoading}
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

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={otp.length !== 6 || isLoading || countdown === 0}
                  className="w-full rounded-full bg-charcoal text-cream hover:bg-charcoal/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <div className="flex flex-col items-center gap-2">
                  {/* Resend OTP */}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCountdown > 0 || isLoading}
                    className="text-sm text-muted-foreground hover:text-charcoal transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCountdown > 0 ? (
                      <>Resend OTP in {formatTime(resendCountdown)}</>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>

                  {/* Change Email */}
                <button
                  type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError(null);
                    }}
                    disabled={isLoading}
                    className="text-sm text-muted-foreground hover:text-charcoal transition-colors font-sans"
                >
                  Use a different email
                </button>
                </div>
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
