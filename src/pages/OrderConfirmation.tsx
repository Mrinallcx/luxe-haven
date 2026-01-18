import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ExternalLink, Copy, ArrowRight, Sparkles, Shield, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const OrderConfirmation = () => {
  const location = useLocation();
  const { txHash, productName, price, coin } = location.state || {};
  const [copied, setCopied] = useState(false);

  const etherscanUrl = import.meta.env.VITE_ETHERSCAN_URL || "https://sepolia.etherscan.io";

  const truncateHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const copyToClipboard = async () => {
    if (txHash) {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      toast.success("Transaction hash copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-[800px]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-28 h-28 mx-auto mb-8"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse" />
            {/* Inner circle */}
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
            </div>
            {/* Sparkles */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-gold" />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-serif font-light text-foreground mb-4"
          >
            Purchase Complete!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-10 max-w-md mx-auto"
          >
            Your transaction has been confirmed on the blockchain. Welcome to the world of tokenized assets!
          </motion.p>

          {/* Transaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-charcoal to-charcoal/90 border-gold/20 mb-8 overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gold/10 border-b border-gold/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Gem className="w-5 h-5 text-gold" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gold/70 font-medium">Asset Purchased</p>
                        <p className="text-lg text-cream font-medium">{productName || "Digital Asset"}</p>
                      </div>
                    </div>
                    {price && (
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-cream">${price?.toLocaleString()}</p>
                        {coin && <p className="text-xs text-gold/70">{coin}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="p-6 space-y-4">
                  {txHash && (
                    <div className="bg-background/5 rounded-xl p-4 border border-gold/10">
                      <p className="text-xs text-gold/60 uppercase tracking-wider mb-2 text-left">Transaction Hash</p>
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-cream font-mono text-sm bg-background/10 px-3 py-2 rounded-lg flex-1 text-left truncate">
                          {truncateHash(txHash)}
                        </code>
                        <div className="flex gap-2">
                          <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-gold/70 hover:text-gold"
                            title="Copy hash"
                          >
                            <Copy className={`w-4 h-4 ${copied ? "text-green-400" : ""}`} />
                          </button>
                          <a
                            href={`${etherscanUrl}/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-gold/70 hover:text-gold"
                            title="View on Etherscan"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400 font-medium">Confirmed on Blockchain</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid sm:grid-cols-2 gap-4 mb-10"
          >
            <Card className="bg-muted/10 border-border/50">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground mb-1">Secure Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Your asset is securely stored and fully insured in our vault.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/10 border-border/50">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Gem className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground mb-1">NFT Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Your NFT represents verifiable ownership of the physical asset.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/account">
              <Button variant="outline" className="rounded-full w-full sm:w-auto px-8 py-5">
                View My Assets
              </Button>
            </Link>
            <Link to="/">
              <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal w-full sm:w-auto px-8 py-5">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
