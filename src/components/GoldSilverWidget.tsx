import { useState } from "react";
import { motion } from "framer-motion";

const GoldSilverWidget = () => {
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [mode, setMode] = useState<"euros" | "grams">("euros");
  const [amount, setAmount] = useState("2100");

  const prices = {
    gold: 13276.23,
    silver: 103.50,
  };

  const currentPrice = prices[activeTab];
  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const calculatedGrams = mode === "euros" ? (numericAmount / currentPrice).toFixed(4) : numericAmount.toFixed(4);
  const calculatedEuros = mode === "grams" ? (numericAmount * currentPrice).toFixed(2) : numericAmount.toFixed(2);

  const quickAmounts = ["500", "2,000", "5,000", "10,000"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-cream rounded-2xl p-6 shadow-xl max-w-sm w-full"
    >
      {/* Tabs */}
      <div className="flex border-b border-charcoal/10 mb-6">
        <button
          onClick={() => setActiveTab("gold")}
          className={`flex-1 pb-3 text-lg font-serif transition-colors ${
            activeTab === "gold"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-charcoal/40"
          }`}
        >
          Digital Gold
        </button>
        <button
          onClick={() => setActiveTab("silver")}
          className={`flex-1 pb-3 text-lg font-serif transition-colors ${
            activeTab === "silver"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-charcoal/40"
          }`}
        >
          Digital Silver
        </button>
      </div>

      {/* Live Price */}
      <div className="mb-6">
        <p className="text-gold font-medium text-sm mb-1">Live Buy Price</p>
        <div className="flex items-baseline gap-2">
          <span className="text-charcoal font-bold text-2xl uppercase">
            {activeTab}
          </span>
          <span className="text-charcoal font-bold text-2xl">
            € {currentPrice.toLocaleString()}/gm
          </span>
          <span className="text-charcoal/50 text-sm ml-auto">including VAT</span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-charcoal/5 rounded-full p-1 flex">
          <button
            onClick={() => setMode("euros")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "euros"
                ? "bg-charcoal text-cream"
                : "text-charcoal/60"
            }`}
          >
            EUROS
          </button>
          <button
            onClick={() => setMode("grams")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "grams"
                ? "bg-charcoal text-cream"
                : "text-charcoal/60"
            }`}
          >
            GRAMS
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="border-2 border-gold/60 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-charcoal/60 text-lg">
              {mode === "euros" ? "€" : "gm"}
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))}
              className="text-3xl font-bold text-charcoal bg-transparent border-none outline-none w-24"
            />
          </div>
          <span className="text-charcoal/60">
            = {mode === "euros" ? `${calculatedGrams} gm` : `€ ${calculatedEuros}`}
          </span>
        </div>

        {/* Quick Amounts */}
        <div className="flex gap-2 justify-between">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className="text-charcoal/70 text-sm hover:text-charcoal transition-colors"
            >
              {mode === "euros" ? `€ ${quickAmount}` : `${quickAmount} gm`}
            </button>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <button className="w-full bg-gold text-charcoal font-semibold py-3 rounded-full hover:bg-champagne transition-colors">
        PROCEED
      </button>
    </motion.div>
  );
};

export default GoldSilverWidget;
