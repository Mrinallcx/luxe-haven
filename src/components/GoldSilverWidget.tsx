import { useState } from "react";
import { motion } from "framer-motion";

const GoldSilverWidget = () => {
  const [activeTab, setActiveTab] = useState<"gold" | "silver" | "platinum">("gold");

  const prices = {
    gold: 13276.23,
    silver: 103.50,
    platinum: 12450.00,
  };

  const currentPrice = prices[activeTab];

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
        <p className="text-gold font-sans text-sm mb-1">Live Buy Price</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-charcoal font-sans font-bold text-2xl">
            $ {currentPrice.toLocaleString()}/gm
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GoldSilverWidget;
