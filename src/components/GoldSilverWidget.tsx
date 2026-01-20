import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getCommodityPrices } from "@/lib/market-api";

// Conversion factor: 1 troy ounce = 31.1035 grams
const TROY_OUNCE_TO_GRAMS = 31.1035;

interface CommodityPrices {
  gold: number;
  silver: number;
  platinum: number;
}

const GoldSilverWidget = () => {
  const [activeTab, setActiveTab] = useState<"gold" | "silver" | "platinum">("gold");
  const [prices, setPrices] = useState<CommodityPrices>({
    gold: 0,
    silver: 0,
    platinum: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch commodity prices
  const fetchPrices = useCallback(async () => {
    try {
      const response = await getCommodityPrices();
      
      if (response.data?.success && response.data.rates) {
        const { XAU, XAG, XPT } = response.data.rates;
        
        // Convert from price per troy ounce to price per gram
        setPrices({
          gold: XAU / TROY_OUNCE_TO_GRAMS,
          silver: XAG / TROY_OUNCE_TO_GRAMS,
          platinum: XPT / TROY_OUNCE_TO_GRAMS,
        });
        
        setLastUpdated(new Date(response.data.timestamp * 1000));
        setError(null);
      } else if (response.error) {
        console.error("Error fetching commodity prices:", response.error);
        setError("Unable to fetch prices");
      }
    } catch (err) {
      console.error("Failed to fetch commodity prices:", err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 30 minutes (prices update every 8 hours on backend)
  useEffect(() => {
    const interval = setInterval(fetchPrices, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const currentPrice = prices[activeTab];

  // Format time ago
  const getTimeAgo = () => {
    if (!lastUpdated) return "";
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return "Just now";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-cream rounded-2xl p-6 shadow-xl max-w-sm w-full"
    >
      {/* Tabs */}
      <div className="flex border-b border-charcoal/10 mb-6 gap-8">
        <button
          onClick={() => setActiveTab("gold")}
          className={`flex-1 pb-3 text-base font-sans font-medium tracking-wide transition-colors ${
            activeTab === "gold"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-charcoal/40"
          }`}
        >
          Gold
        </button>
        <button
          onClick={() => setActiveTab("silver")}
          className={`flex-1 pb-3 text-base font-sans font-medium tracking-wide transition-colors ${
            activeTab === "silver"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-charcoal/40"
          }`}
        >
          Silver
        </button>
        <button
          onClick={() => setActiveTab("platinum")}
          className={`flex-1 pb-3 text-base font-sans font-medium tracking-wide transition-colors ${
            activeTab === "platinum"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-charcoal/40"
          }`}
        >
          Platinum
        </button>
      </div>

      {/* Live Price */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          {/* Blinking red dot for live indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <p className="text-gold font-sans text-sm">Live Buy Price</p>
          {lastUpdated && (
            <span className="text-charcoal/40 text-xs ml-auto">{getTimeAgo()}</span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 flex-wrap">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-32 bg-charcoal/10 animate-pulse rounded"></div>
            </div>
          ) : error ? (
            <span className="text-charcoal/60 font-sans text-lg">
              Price unavailable
            </span>
          ) : (
            <span className="text-charcoal font-sans font-bold text-2xl">
              $ {currentPrice.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}/gm
            </span>
          )}
        </div>
        
        {/* Price per ounce (smaller text) */}
        {!loading && !error && currentPrice > 0 && (
          <p className="text-charcoal/50 text-xs mt-1">
            ${(currentPrice * TROY_OUNCE_TO_GRAMS).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}/oz
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GoldSilverWidget;
