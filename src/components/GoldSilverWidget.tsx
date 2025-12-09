import { motion } from "framer-motion";

const GoldSilverWidget = () => {
  const metals = [
    {
      name: "Digital Gold",
      purity: "24K 99.99% Pure Gold",
      buyPrice: "8,847.79",
      sellPrice: "8,647.79",
      icon: "🪙",
    },
    {
      name: "Digital Silver",
      purity: "99.99% Pure Silver",
      buyPrice: "103.50",
      sellPrice: "98.50",
      icon: "🥈",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-charcoal/60 backdrop-blur-md rounded-2xl p-6 border border-cream/10 max-w-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cream font-serif text-lg">Live Prices</h3>
        <span className="text-xs text-cream/50">Per gram + 3% GST</span>
      </div>

      <div className="space-y-4">
        {metals.map((metal, index) => (
          <div
            key={metal.name}
            className="bg-charcoal/40 rounded-xl p-4 border border-cream/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{metal.icon}</span>
              <div>
                <p className="text-cream font-medium">{metal.name}</p>
                <p className="text-cream/50 text-xs">{metal.purity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
                <p className="text-cream/60 text-xs mb-1">Buy</p>
                <p className="text-emerald-400 font-semibold">₹{metal.buyPrice}</p>
              </div>
              <div className="bg-rose-500/10 rounded-lg p-3 text-center">
                <p className="text-cream/60 text-xs mb-1">Sell</p>
                <p className="text-rose-400 font-semibold">₹{metal.sellPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-gold text-charcoal font-medium py-3 rounded-xl hover:bg-champagne transition-colors">
        Start Trading
      </button>
    </motion.div>
  );
};

export default GoldSilverWidget;
