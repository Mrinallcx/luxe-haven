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
import totoIcon from "@/assets/Toto_Icon.svg";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn?: (user?: { emailId: string }) => void;
  stayOnPage?: boolean; // If true, don't redirect to account page after sign in. Defaults to true.
  redirectTo?: string; // Optional redirect path after sign in (only if stayOnPage is false)
}

type Step = "email" | "otp" | "success";

const SignInModal = ({ open, onOpenChange, onSignIn, stayOnPage = true, redirectTo }: SignInModalProps) => {
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
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState<string>("");

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

  // Auto-verify when 6 digits are entered (only if it's a new OTP)
  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isLoading && countdown > 0 && otp !== lastVerifiedOtp) {
      // Small delay to ensure the last digit is fully entered
      const timer = setTimeout(() => {
        verifyOtpCode();
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step, isLoading, countdown, lastVerifiedOtp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Validate email format before making API call
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await requestOtp(email);

    setIsLoading(false);

    if (response.error) {
      // Show user-friendly error message
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
    setLastVerifiedOtp(""); // Reset verification state when resending

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

  const verifyOtpCode = async () => {
    if (otp.length !== 6 || isLoading || countdown === 0 || otp === lastVerifiedOtp) return;

    const currentOtp = otp; // Store current OTP before verification
    setIsLoading(true);
    setError(null);
    setLastVerifiedOtp(currentOtp); // Mark this OTP as verified

    const response = await verifyOtp(email, currentOtp);

    setIsLoading(false);

    if (response.error) {
      // Show user-friendly error message
      setError("OTP incorrect, please enter valid OTP");
      // Clear the OTP so user can enter a new one
      setOtp("");
      setLastVerifiedOtp(""); // Reset so new OTP can be verified
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
        // Only redirect if stayOnPage is false
        if (!stayOnPage) {
          navigate(redirectTo || "/account");
        }
        // Reset state for next time
        resetState();
      }, 2000);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtpCode();
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
    setLastVerifiedOtp("");
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
            <img 
              src={totoIcon} 
              alt="Toto Finance" 
              className="h-20 w-auto mx-auto"
            />
            <p className="text-sm text-muted-foreground font-sans">
              Building the Future of Global Trade
            </p>
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
                      // Always clear error and reset verification state when user types
                      setError(null);
                      setLastVerifiedOtp("");
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

                {/* Loading indicator when auto-verifying */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </motion.div>
                )}

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
