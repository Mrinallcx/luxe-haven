import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ShoppingCart, Check, Plus, Minus, Gavel, Shuffle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import PlaceBidModal from "@/components/PlaceBidModal";
import ProductName from "@/components/ProductName";
import { getAuthMarkets, buildAuthMarketsPayload, normalizeProduct, ApiTrendingProduct } from "@/lib/market-api";

// Import asset images
import diamondProduct from "@/assets/diamond-product.webp";
import goldProduct from "@/assets/gold-product.webp";
import silverProduct from "@/assets/silver-product.webp";
import platinumProduct from "@/assets/platinum-product.webp";
import sapphireProduct from "@/assets/sapphire-product.webp";

interface DemandUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "asset" | "budget" | "results";

const assetOptions = [
  { id: "diamonds", label: "Diamonds", image: diamondProduct },
  { id: "gold", label: "Gold", image: goldProduct },
  { id: "silver", label: "Silver", image: silverProduct },
  { id: "platinum", label: "Platinum", image: platinumProduct },
  { id: "sapphire", label: "Sapphire", image: sapphireProduct },
];

const budgetOptions = [
  { value: 5000, label: "$5,000" },
  { value: 10000, label: "$10,000" },
  { value: 25000, label: "$25,000" },
  { value: 50000, label: "$50,000" },
  { value: 100000, label: "$100,000" },
];


const DemandUsModal = ({ open, onOpenChange }: DemandUsModalProps) => {
  const [step, setStep] = useState<Step>("asset");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState<string>("");
  const [cartItems, setCartItems] = useState<Map<number, number>>(new Map());
  
  // Place Bid Modal state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedBidProduct, setSelectedBidProduct] = useState<Product | null>(null);
  
  // Filter state (simplified)
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [caratRange, setCaratRange] = useState<number[]>([0.1, 10]);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  
  // API state
  const [apiProducts, setApiProducts] = useState<(Product & { _id?: string })[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const { addToCart } = useCart();

  const handlePlaceBid = (product: Product) => {
    setSelectedBidProduct(product);
    setIsBidModalOpen(true);
  };

  const effectiveBudget = customBudget ? parseInt(customBudget) : selectedBudget;

  // Fetch products from API when on results step
  const fetchProducts = useCallback(async () => {
    if (!selectedAsset || !effectiveBudget || step !== "results") {
      return;
    }

    setIsLoadingProducts(true);

    try {
      // Build payload - only fetch on-sale items (FIXEDPRICE) within budget
      const payload = buildAuthMarketsPayload(selectedAsset, 1, {
        saleType: "FIXEDPRICE", // Only unsold/on-sale items
        priceRangeMin: 1,
        priceRangeMax: effectiveBudget,
        ...(selectedAsset === "diamonds" && {
          minCarat: caratRange[0],
          maxCarat: caratRange[1],
          cut: selectedCuts,
          clarity: selectedClarity,
        }),
        ...(selectedAsset === "sapphire" && {
          minCarat: caratRange[0],
          maxCarat: caratRange[1],
          cut: selectedCuts,
        }),
      });

      const response = await getAuthMarkets(payload);

      if (response.data?.result && response.data.result.length > 0) {
        // Filter out already sold items (those with firstSoldAt)
        const unsoldItems = response.data.result.filter((p: ApiTrendingProduct) => !p.firstSoldAt);

        let products = unsoldItems.map((p: ApiTrendingProduct) => {
          const normalized = normalizeProduct(p);
          return {
            ...normalized,
            id: normalized.id,
            _id: normalized._id,
          };
        });

    // Shuffle products based on seed
        products = [...products].sort(() => {
          const rand = Math.sin(shuffleSeed + Math.random()) * 10000;
      return rand - Math.floor(rand) - 0.5;
    });

        setApiProducts(products.slice(0, 12));
      } else {
        setApiProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setApiProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedAsset, effectiveBudget, step, caratRange, selectedCuts, selectedClarity, shuffleSeed]);

  // Fetch products when step changes to results or filters change
  useEffect(() => {
    if (step === "results") {
      fetchProducts();
    }
  }, [step, fetchProducts]);

  const handleReshuffle = () => {
    setShuffleSeed(prev => prev + 1);
  };

  // Use API products instead of mock data
  const filteredProducts = apiProducts;

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
      const product = apiProducts.find(p => p.id === productId);
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
    setCartItems(new Map());
    setSelectedCuts([]);
    setSelectedClarity([]);
    setCaratRange([0.1, 10]);
    setApiProducts([]);
    onOpenChange(false);
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
            <h2 className="font-serif font-light text-xl text-foreground">Demand Us</h2>
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
                      className={`rounded-xl border overflow-hidden transition-all hover:border-gold ${
                        selectedAsset === asset.id ? "border-gold ring-2 ring-gold/30" : "border-border"
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <img 
                          src={asset.image} 
                          alt={asset.label}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-2 bg-background">
                      <span className="text-sm font-medium text-foreground">{asset.label}</span>
                      </div>
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
                <div className="flex items-center justify-between mb-2 gap-2">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleReshuffle}
                    disabled={isLoadingProducts}
                      className="gap-2"
                    >
                    <Shuffle className={`w-4 h-4 ${isLoadingProducts ? "animate-spin" : ""}`} />
                      Reshuffle
                    </Button>
                </div>

                {/* Loading State */}
                {isLoadingProducts && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                      </div>
                  )}

                {/* Results */}
                {!isLoadingProducts && (
                  <>
                <p className="text-sm text-muted-foreground">
                  Found {filteredProducts.length} {assetOptions.find(a => a.id === selectedAsset)?.label} under ${effectiveBudget?.toLocaleString()}
                </p>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          No {assetOptions.find(a => a.id === selectedAsset)?.label} available within your budget.
                        </p>
                        <p className="text-muted-foreground text-xs mt-2">
                          Try increasing your budget or changing filters.
                        </p>
                      </div>
                    )}

                    {/* Product Grid - Fixed min-height to prevent layout shift during reshuffle */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[400px]">
                  {filteredProducts.map((product) => {
                    const isInCart = cartItems.has(product.id);
                    const qty = cartItems.get(product.id) || 0;
                    const isAuction = product.status === "auction";
                    
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-xl overflow-hidden transition-all ${
                              isInCart ? "border-gold" : "border-border hover:border-gold/50"
                            }`}
                          >
                            {/* Clickable Image - Links to product page */}
                            <Link 
                              to={`/product/${product.id}`} 
                              state={{ product }}
                              onClick={() => onOpenChange(false)}
                              className="block"
                            >
                              <div className="aspect-square relative cursor-pointer group">
                          <img
                            src={product.image}
                            alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                            </Link>
                        <div className="p-2">
                              <Link 
                                to={`/product/${product.id}`} 
                                state={{ product }}
                                onClick={() => onOpenChange(false)}
                                className="block hover:text-gold transition-colors"
                              >
                                <p className="text-xs font-medium text-foreground truncate hover:text-gold"><ProductName name={product.name} /></p>
                              </Link>
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
                  </>
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
