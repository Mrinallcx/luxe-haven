import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SignInModal from "@/components/SignInModal";

interface CheckoutProtectedRouteProps {
  children: React.ReactNode;
}

const CheckoutProtectedRoute = ({ children }: CheckoutProtectedRouteProps) => {
  const { isSignedIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      setShowSignIn(true);
    }
  }, [isSignedIn]);

  // Handle sign-in modal close - redirect to cart if closed without signing in
  const handleSignInClose = (open: boolean) => {
    setShowSignIn(open);
    if (!open && !isSignedIn) {
      navigate("/cart", { replace: true });
    }
  };

  // If not signed in, show sign-in modal and redirect to cart
  if (!isSignedIn) {
    return (
      <>
        <SignInModal 
          open={showSignIn} 
          onOpenChange={handleSignInClose}
        />
        <Navigate to="/cart" replace />
      </>
    );
  }

  // Signed in - allow access (wallet connection will be checked in Checkout component if Web3 is selected)
  return <>{children}</>;
};

export default CheckoutProtectedRoute;
