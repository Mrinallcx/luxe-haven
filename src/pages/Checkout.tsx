import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useWallet } from "@/contexts/WalletContext";
import WalletConnectModal from "@/components/WalletConnectModal";
import { ArrowLeft, CreditCard, Wallet, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Payment method icons as SVG components
const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.651h6.16c2.046 0 3.661.418 4.805 1.243 1.146.826 1.657 2.063 1.52 3.678-.137 1.613-.897 2.952-2.261 3.983-1.362 1.03-3.075 1.552-5.095 1.552H8.58l-.997 6.328a.641.641 0 0 1-.633.54h-.874v1.944z"/>
    <path d="M19.95 7.29c-.137 1.613-.897 2.952-2.261 3.983-1.362 1.03-3.075 1.552-5.095 1.552h-2.25l-.997 6.328a.641.641 0 0 1-.633.54H6.87l-.128.807a.641.641 0 0 0 .633.74h3.606a.77.77 0 0 0 .757-.651l.797-5.03h2.05c2.02 0 3.733-.522 5.095-1.552 1.364-1.031 2.124-2.37 2.261-3.983.138-1.615-.374-2.852-1.52-3.678-.266-.192-.56-.36-.878-.506.242.41.407.882.496 1.45z"/>
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M17.72 13.2c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.65-.17-3.24.98-4.08.98-.85 0-2.14-.96-3.53-.93-1.81.03-3.49 1.06-4.42 2.69-1.9 3.28-.48 8.14 1.35 10.81.9 1.3 1.97 2.76 3.37 2.71 1.36-.05 1.87-.88 3.51-.88 1.63 0 2.1.88 3.52.85 1.46-.02 2.39-1.31 3.27-2.63 1.04-1.5 1.46-2.96 1.48-3.04-.03-.01-2.85-1.1-2.88-4.35zM15.02 4.74c.74-.9 1.24-2.14 1.1-3.39-1.07.04-2.37.72-3.13 1.61-.69.79-1.29 2.07-1.13 3.29 1.19.09 2.41-.6 3.16-1.51z"/>
  </svg>
);

const Web3Icon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

type PaymentMethod = "paypal" | "apple" | "card" | "web3" | null;

const paymentMethods = [
  {
    id: "paypal" as const,
    name: "PayPal",
    icon: PayPalIcon,
    comingSoon: true,
    description: "Pay with your PayPal account"
  },
  {
    id: "apple" as const,
    name: "Apple Pay",
    icon: ApplePayIcon,
    comingSoon: true,
    description: "Pay with Apple Pay"
  },
  {
    id: "card" as const,
    name: "Credit / Debit Card",
    icon: CreditCard,
    comingSoon: false,
    description: "Pay with Visa, Mastercard, or Amex"
  },
  {
    id: "web3" as const,
    name: "Web3 Wallet",
    icon: Wallet,
    comingSoon: false,
    description: "Pay with MetaMask, WalletConnect, etc."
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { isConnected } = useWallet();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-[1400px]">
          <div className="text-center py-20">
            <h1 className="text-2xl font-serif font-light text-foreground mb-4">No Items to Checkout</h1>
            <p className="text-muted-foreground mb-8">
              Your cart is empty. Add some items before proceeding to checkout.
            </p>
            <Link to="/">
              <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const total = subtotal;

  const handleSelectMethod = (methodId: PaymentMethod) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method?.comingSoon) {
      toast.info(`${method.name} is coming soon!`);
      return;
    }
    setSelectedMethod(methodId);
    
    // If Web3 wallet is selected and wallet is not connected, show wallet modal
    if (methodId === "web3" && !isConnected) {
      setShowWalletModal(true);
    }
  };

  const handleProceed = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    // If Web3 wallet is selected, ensure wallet is connected
    if (selectedMethod === "web3" && !isConnected) {
      setShowWalletModal(true);
      toast.error("Please connect your wallet to proceed with Web3 payment");
      return;
    }
    
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-[1400px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-serif font-light text-foreground mb-6">Select Payment Method</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        isSelected 
                          ? "border-gold bg-gold/5" 
                          : method.comingSoon 
                            ? "border-border bg-muted/20 opacity-60" 
                            : "border-border hover:border-gold/50 bg-card"
                      }`}
                      onClick={() => handleSelectMethod(method.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${
                            isSelected ? "bg-gold/20 text-gold" : "bg-muted/30 text-foreground"
                          }`}>
                            <Icon />
                          </div>
                          {method.comingSoon ? (
                            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">
                              Coming Soon
                            </span>
                          ) : isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                              <Check className="w-4 h-4 text-charcoal" />
                            </div>
                          ) : null}
                        </div>
                        
                        <h3 className={`font-medium mb-1 ${
                          method.comingSoon ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {method.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/20 border-border sticky top-28">
              <CardContent className="p-6">
                <h2 className="text-lg font-serif font-light text-foreground mb-6">Order Summary</h2>
                
                {/* Items Preview */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-xl font-semibold text-foreground">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mb-6">
                  <p className="text-xs text-muted-foreground mb-2">We accept crypto payment in</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">ETH</span>
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">wETH</span>
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">LCX</span>
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">USDC</span>
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">USDT</span>
                    <span className="text-xs px-2 py-1 bg-muted/50 rounded text-foreground">ADA</span>
                  </div>
                </div>

                <Button 
                  className="w-full rounded-full bg-gold hover:bg-gold/90 text-charcoal font-medium py-6"
                  onClick={handleProceed}
                  disabled={!selectedMethod}
                >
                  Complete Order
                </Button>

                <Link to="/cart" className="block mt-4">
                  <Button variant="outline" className="w-full rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <WalletConnectModal 
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
      />
    </div>
  );
};

export default Checkout;
