import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Settings2, ShoppingCart, Check, Plus, Minus, Gavel } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allProducts, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import PlaceBidModal from "@/components/PlaceBidModal";

interface DemandUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "asset" | "budget" | "results";

const assetOptions = [
  { id: "diamonds", label: "Diamonds", icon: "💎" },
  { id: "gold", label: "Gold", icon: "🥇" },
  { id: "silver", label: "Silver", icon: "🥈" },
  { id: "platinum", label: "Platinum", icon: "⚪" },
  { id: "sapphire", label: "Sapphire", icon: "💙" },
];

const budgetOptions = [
  { value: 5000, label: "$5,000" },
  { value: 10000, label: "$10,000" },
  { value: 25000, label: "$25,000" },
  { value: 50000, label: "$50,000" },
  { value: 100000, label: "$100,000" },
];

const cutOptions = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald"];
const clarityOptions = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1"];
const saleTypeOptions = ["Fixed", "Auction"];

const DemandUsModal = ({ open, onOpenChange }: DemandUsModalProps) => {
  const [step, setStep] = useState<Step>("asset");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cartItems, setCartItems] = useState<Map<number, number>>(new Map());
  
  // Place Bid Modal state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedBidProduct, setSelectedBidProduct] = useState<Product | null>(null);
  
  // Advanced filters
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [selectedSaleType, setSelectedSaleType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

  const { addToCart } = useCart();

  const handlePlaceBid = (product: Product) => {
    setSelectedBidProduct(product);
    setIsBidModalOpen(true);
  };

  const effectiveBudget = customBudget ? parseInt(customBudget) : selectedBudget;

  const filteredProducts = useMemo(() => {
    let products = allProducts.filter(p => p.category === selectedAsset);
    
    if (effectiveBudget) {
      products = products.filter(p => p.price <= effectiveBudget);
    }

    if (showAdvanced) {
      if (priceRange[0] > 0 || priceRange[1] < 100000) {
        products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      }
      if (selectedCuts.length > 0) {
        products = products.filter(p => selectedCuts.some(cut => p.name.toLowerCase().includes(cut.toLowerCase())));
      }
      if (selectedSaleType.length > 0) {
        products = products.filter(p => p.status && selectedSaleType.map(s => s.toLowerCase() === "fixed" ? "sale" : "auction").includes(p.status));
      }
    }

    return products.slice(0, 12);
  }, [selectedAsset, effectiveBudget, showAdvanced, priceRange, selectedCuts, selectedSaleType]);

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    setStep("budget");
  };

  const handleBudgetSelect = (budget: number) => {
    setSelectedBudget(budget);
    setCustomBudget("");
  };

  const handleContinue = () => {
    if (effectiveBudget && effectiveBudget > 0) {
      setStep("results");
    }
  };

  const handleBack = () => {
    if (step === "budget") setStep("asset");
    else if (step === "results") setStep("budget");
  };

  const toggleCartItem = (product: Product) => {
    const newCartItems = new Map(cartItems);
    if (newCartItems.has(product.id)) {
      newCartItems.delete(product.id);
    } else {
      newCartItems.set(product.id, 1);
    }
    setCartItems(newCartItems);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const newCartItems = new Map(cartItems);
    const current = newCartItems.get(productId) || 1;
    const newQty = current + delta;
    if (newQty <= 0) {
      newCartItems.delete(productId);
    } else {
      newCartItems.set(productId, newQty);
    }
    setCartItems(newCartItems);
  };

  const handleAddAllToCart = () => {
    cartItems.forEach((qty, productId) => {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        for (let i = 0; i < qty; i++) {
          addToCart(product);
        }
      }
    });
    toast.success(`${cartItems.size} item(s) added to cart`);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("asset");
    setSelectedAsset("");
    setSelectedBudget(null);
    setCustomBudget("");
    setShowAdvanced(false);
    setCartItems(new Map());
    setSelectedCuts([]);
    setSelectedClarity([]);
    setSelectedSaleType([]);
    setPriceRange([0, 100000]);
    onOpenChange(false);
  };

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const totalCartItems = Array.from(cartItems.values()).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden bg-background border-border">
        <VisuallyHidden>
          <DialogTitle>Demand Us</DialogTitle>
          <DialogDescription>Find assets based on your preferences and budget</DialogDescription>
        </VisuallyHidden>
        <div className="p-6 pb-0">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-foreground">Demand Us</h2>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {["asset", "budget", "results"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s ? "bg-gold text-charcoal" : 
                  ["asset", "budget", "results"].indexOf(step) > i ? "bg-gold/30 text-foreground" : 
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <ScrollArea className="px-6 pb-6 max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Asset Selection */}
            {step === "asset" && (
              <motion.div
                key="asset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground text-sm">Choose the asset type you're looking for:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {assetOptions.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleAssetSelect(asset.id)}
                      className={`p-4 rounded-xl border transition-all hover:border-gold hover:bg-gold/5 ${
                        selectedAsset === asset.id ? "border-gold bg-gold/10" : "border-border"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{asset.icon}</span>
                      <span className="text-sm font-medium text-foreground">{asset.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Budget Selection */}
            {step === "budget" && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  Select your budget for {assetOptions.find(a => a.id === selectedAsset)?.label}:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => handleBudgetSelect(budget.value)}
                      className={`p-3 rounded-xl border transition-all hover:border-gold hover:bg-gold/5 ${
                        selectedBudget === budget.value && !customBudget ? "border-gold bg-gold/10" : "border-border"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{budget.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm text-muted-foreground">Or enter custom budget:</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customBudget}
                      onChange={(e) => {
                        setCustomBudget(e.target.value);
                        setSelectedBudget(null);
                      }}
                      className="flex-1"
                    />
                    <span className="flex items-center text-muted-foreground">USD</span>
                  </div>
                </div>

                <Button 
                  onClick={handleContinue} 
                  disabled={!effectiveBudget || effectiveBudget <= 0}
                  className="w-full mt-4 bg-gold hover:bg-gold/90 text-charcoal rounded-full"
                >
                  Find {assetOptions.find(a => a.id === selectedAsset)?.label}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="gap-2"
                  >
                    <Settings2 className="w-4 h-4" />
                    {showAdvanced ? "Hide Filters" : "Advanced Filters"}
                  </Button>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-border rounded-xl p-4 space-y-4 overflow-hidden"
                    >
                      {/* Price Range */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={0}
                          max={100000}
                          step={500}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${priceRange[0].toLocaleString()}</span>
                          <span>${priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Cut Filter */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Cut</label>
                        <div className="flex flex-wrap gap-2">
                          {cutOptions.map((cut) => (
                            <button
                              key={cut}
                              onClick={() => toggleFilter(cut, selectedCuts, setSelectedCuts)}
                              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                selectedCuts.includes(cut) 
                                  ? "bg-gold/20 border-gold text-foreground" 
                                  : "border-border text-muted-foreground hover:border-gold/50"
                              }`}
                            >
                              {cut}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sale Type Filter */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Sale Type</label>
                        <div className="flex gap-2">
                          {saleTypeOptions.map((type) => (
                            <button
                              key={type}
                              onClick={() => toggleFilter(type, selectedSaleType, setSelectedSaleType)}
                              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                selectedSaleType.includes(type) 
                                  ? "bg-gold/20 border-gold text-foreground" 
                                  : "border-border text-muted-foreground hover:border-gold/50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-sm text-muted-foreground">
                  Found {filteredProducts.length} {assetOptions.find(a => a.id === selectedAsset)?.label} under ${effectiveBudget?.toLocaleString()}
                </p>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((product) => {
                    const isInCart = cartItems.has(product.id);
                    const qty = cartItems.get(product.id) || 0;
                    const isAuction = product.status === "auction";
                    
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-xl overflow-hidden transition-all ${
                          isInCart ? "border-gold" : "border-border"
                        }`}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.status && (
                            <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                              product.status === "sale" 
                                ? "bg-charcoal/90 text-cream" 
                                : "bg-gold/90 text-charcoal"
                            }`}>
                              {product.status === "sale" ? "On Sale" : "Auction"}
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-gold font-semibold">${product.price.toLocaleString()}</p>
                          
                          {isAuction ? (
                            <Button
                              size="sm"
                              onClick={() => handlePlaceBid(product)}
                              className="w-full mt-2 h-7 text-xs bg-gold hover:bg-gold/90 text-charcoal rounded-lg gap-1"
                            >
                              <Gavel className="w-3 h-3" />
                              Place Bid
                            </Button>
                          ) : isInCart ? (
                            <div className="flex items-center justify-between mt-2">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium">{qty}</span>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => toggleCartItem(product)}
                              className="w-full mt-2 h-7 text-xs bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No products found within your budget.</p>
                    <p className="text-sm">Try increasing your budget or adjusting filters.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer with Cart Summary - Fixed positioning */}
        {step === "results" && cartItems.size > 0 && (
          <div className="sticky bottom-0 left-0 right-0 border-t border-border p-4 bg-background z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingCart className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-sm text-foreground truncate">{totalCartItems} item(s) selected</span>
              </div>
              <Button
                onClick={handleAddAllToCart}
                className="bg-gold hover:bg-gold/90 text-charcoal rounded-full gap-2 flex-shrink-0"
              >
                <Check className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      
      {/* Place Bid Modal */}
      <PlaceBidModal
        open={isBidModalOpen}
        onOpenChange={setIsBidModalOpen}
        productName={selectedBidProduct?.name}
        minimumBid={selectedBidProduct?.price ? Math.floor(selectedBidProduct.price * 0.8) : 100}
        increment={1000}
        currency="LCX"
      />
    </Dialog>
  );
};

export default DemandUsModal;
