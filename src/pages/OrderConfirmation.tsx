import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { getEtherscanUrl } from "@/utils/product-helpers";

const OrderConfirmation = () => {
  const location = useLocation();
  const { txHash, productName, price, coin } = location.state || {};
  const [copied, setCopied] = useState(false);

  const etherscanUrl = getEtherscanUrl();

  const truncateHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 12)}...${hash.slice(-10)}`;
  };

  const copyToClipboard = async () => {
    if (txHash) {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl scale-150" />
              
              {/* Main circle */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold via-gold to-amber-600 flex items-center justify-center shadow-lg">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <Check className="w-12 h-12 text-charcoal" strokeWidth={3} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3 tracking-tight">
              Transaction Complete
            </h1>
            <p className="text-muted-foreground">
              Your purchase has been confirmed on the blockchain
            </p>
          </motion.div>

          {/* Asset Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              {/* Asset Info */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Asset Acquired
                    </p>
                    <h2 className="text-xl font-medium text-foreground">
                      {productName || "Digital Asset"}
                    </h2>
                  </div>
                  {price && (
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-foreground">
                        ${typeof price === 'number' ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price}
                      </p>
                      {coin && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {coin}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Hash */}
              {txHash && (
                <div className="p-6 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Transaction
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Confirmed
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm text-foreground/80 bg-background px-4 py-3 rounded-lg border border-border truncate">
                      {truncateHash(txHash)}
                    </code>
                    
                    <button
                      onClick={copyToClipboard}
                      className="p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                      title="Copy hash"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    
                    <a
                      href={`${etherscanUrl}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">
              What's Next
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-medium">1</span>
                </div>
                <p className="text-sm text-foreground font-medium mb-1">Stored Securely</p>
                <p className="text-xs text-muted-foreground">Vaulted & insured</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-medium">2</span>
                </div>
                <p className="text-sm text-foreground font-medium mb-1">NFT Minted</p>
                <p className="text-xs text-muted-foreground">Proof of ownership</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-medium">3</span>
                </div>
                <p className="text-sm text-foreground font-medium mb-1">Trade Anytime</p>
                <p className="text-xs text-muted-foreground">List or redeem</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/account" className="flex-1 sm:flex-initial">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto px-8 py-6 rounded-xl text-base"
              >
                View My Assets
              </Button>
            </Link>
            
            <Link to="/" className="flex-1 sm:flex-initial">
              <Button 
                className="w-full sm:w-auto px-8 py-6 rounded-xl text-base bg-charcoal hover:bg-charcoal/90 text-cream dark:bg-gold dark:hover:bg-gold/90 dark:text-charcoal"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Support Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            Questions about your purchase?{" "}
            <a href="mailto:support@totofinance.co" className="text-gold hover:underline">
              Contact Support
            </a>
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
