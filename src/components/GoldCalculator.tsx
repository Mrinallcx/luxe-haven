import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MetalType = "gold" | "silver";
type InputMode = "euros" | "grams";

const metalPrices = {
  gold: 13276.23,
  silver: 1024.50,
};

const quickAmounts = [500, 2000, 5000, 10000];

const GoldCalculator = () => {
  const [metalType, setMetalType] = useState<MetalType>("gold");
  const [inputMode, setInputMode] = useState<InputMode>("euros");
  const [amount, setAmount] = useState<string>("2100");

  const currentPrice = metalPrices[metalType];
  
  const getConvertedValue = () => {
    const numAmount = parseFloat(amount) || 0;
    if (inputMode === "euros") {
      return (numAmount / currentPrice).toFixed(4);
    }
    return (numAmount * currentPrice).toFixed(2);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <section className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg"
          >
            {/* Metal Type Tabs */}
            <div className="flex gap-8 mb-8 border-b border-border">
              <button
                onClick={() => setMetalType("gold")}
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  metalType === "gold"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Digital Gold
                {metalType === "gold" && (
                  <motion.div
                    layoutId="metalTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </button>
              <button
                onClick={() => setMetalType("silver")}
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  metalType === "silver"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Digital Silver
                {metalType === "silver" && (
                  <motion.div
                    layoutId="metalTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </button>
            </div>

            {/* Live Price */}
            <div className="mb-6">
              <p className="text-gold text-sm font-medium mb-2">Live Buy Price</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-2xl lg:text-3xl font-bold">
                  {metalType.toUpperCase()} € {currentPrice.toLocaleString()}/gm
                </h3>
                <span className="text-muted-foreground text-sm">including VAT</span>
              </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-full border border-border p-1">
                <button
                  onClick={() => setInputMode("euros")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    inputMode === "euros"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EUROS
                </button>
                <button
                  onClick={() => setInputMode("grams")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    inputMode === "grams"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  GRAMS
                </button>
              </div>
            </div>

            {/* Calculator Box */}
            <div className="border-2 border-gold/30 rounded-2xl p-6 mb-6">
              {/* Amount Input */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-muted-foreground text-lg">
                    {inputMode === "euros" ? "€" : "gm"}
                  </span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-3xl font-bold border-none bg-transparent p-0 h-auto w-32 focus-visible:ring-0"
                  />
                </div>
                <p className="text-muted-foreground">
                  = {inputMode === "euros" ? getConvertedValue() + " gm" : "€ " + getConvertedValue()}
                </p>
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-3 flex-wrap">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleQuickAmount(quickAmount)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      amount === quickAmount.toString()
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {inputMode === "euros" ? "€" : ""} {quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-6 text-base rounded-full"
            >
              PROCEED
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoldCalculator;
