import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Gavel, Tag, ChevronDown, Loader2, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import ProductName from "@/components/ProductName";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTrendingProducts, normalizeProduct } from "@/lib/market-api";
import diamondProduct from "@/assets/diamond-product.webp";
import goldProduct from "@/assets/gold-product.webp";
import silverProduct from "@/assets/silver-product.webp";
import sapphireProduct from "@/assets/sapphire-product.webp";
import platinumProduct from "@/assets/platinum-product.webp";


// Map category to default image
const getCategoryImage = (category: string): string => {
  const imageMap: Record<string, string> = {
    Diamonds: diamondProduct,
    Gold: goldProduct,
    Silver: silverProduct,
    Platinum: platinumProduct,
    Sapphire: sapphireProduct,
  };
  return imageMap[category] || diamondProduct;
};

const categories = ["Diamonds", "Gold", "Silver", "Platinum", "Sapphire"];
const statusFilters = [
  { value: "all", label: "All", apiValue: "All" },
  { value: "sale", label: "On Sale", apiValue: "FIXEDPRICE" },
  { value: "auction", label: "Auction", apiValue: "AUCTION" },
];

type ProductType = {
  id: number;
  _id?: string;
  name: string;
  price: number;
  pricePerUnit: string;
  image: string;
  category: string;
  purity: string;
  weight: string;
  status: "sale" | "auction";
};

const ProductCard = ({ product, index }: { product: ProductType & { isSoldOut?: boolean }; index: number }) => {
  const { addToCart, isInCart, hasItemInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const alreadyInCart = isInCart(product.id);
  const cartIsFull = hasItemInCart() && !alreadyInCart;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.status === "auction") {
      setIsBidModalOpen(true);
      return;
    }
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      pricePerUnit: product.pricePerUnit,
      image: product.image,
      category: product.category,
      purity: product.purity,
      weight: product.weight,
      status: product.status,
    });
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      pricePerUnit: product.pricePerUnit,
      image: product.image,
      category: product.category,
      purity: product.purity,
      weight: product.weight,
      status: product.status,
    };
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(productData);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <>
    <Link 
      to={`/product/${product.id}`}
      state={{ product }}
    >
      <motion.article
        layout
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {product.isSoldOut ? (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 bg-charcoal/90 text-cream border border-cream/20">
                <Check className="w-3 h-3" />
                Sold
              </span>
            ) : (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
              product.status === "auction" 
                ? "bg-gold/90 text-charcoal" 
                : "bg-charcoal/90 text-cream"
            }`}>
              {product.status === "auction" ? (
                <>
                  <Gavel className="w-3 h-3" />
                  Auction
                </>
              ) : (
                <>
                  <Tag className="w-3 h-3" />
                  On Sale
                </>
              )}
            </span>
            )}
          </div>
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background ${
              inWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-gold text-gold" : "text-foreground"}`} />
          </button>
          {/* Quick Action Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.isSoldOut ? (
              <Button 
                className="w-full bg-charcoal/80 text-cream rounded-lg gap-2 cursor-default"
                disabled
              >
                <Check className="w-4 h-4" />
                Sold
              </Button>
            ) : alreadyInCart ? (
              <Button 
                className="w-full bg-green-600 text-white rounded-lg gap-2 cursor-default"
                disabled
              >
                <Check className="w-4 h-4" />
                In Cart
              </Button>
            ) : cartIsFull ? (
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-muted text-muted-foreground rounded-lg gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart Full
              </Button>
            ) : (
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg gap-2"
              >
                {product.status === "auction" ? (
                  <>
                    <Gavel className="w-4 h-4" />
                    Place Bid
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
            <ProductName name={product.name} />
          </h3>
          
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.status === "auction" ? "current bid" : product.pricePerUnit}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
    <PlaceBidModal
      open={isBidModalOpen}
      onOpenChange={setIsBidModalOpen}
      productName={product.name}
      minimumBid={Math.floor(product.price / 10)}
      increment={1000}
      currency="LCX"
    />
    </>
  );
};

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  defaultSaleType?: "FIXEDPRICE" | "AUCTION";
  showStatusFilter?: boolean;
  shuffleProducts?: boolean;
  reducedTopPadding?: boolean;
}

const FeaturedProducts = ({ 
  title = "Featured Pieces", 
  defaultSaleType = "FIXEDPRICE",
  showStatusFilter = true,
  shuffleProducts = false,
  reducedTopPadding = false,
}: FeaturedProductsProps) => {
  const [activeCategory, setActiveCategory] = useState("Diamonds");
  const [activeStatus, setActiveStatus] = useState("all");
  const [products, setProducts] = useState<(ProductType & { isSoldOut?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fetch products from API when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      // Determine sale type - use filter selection or default
      const statusFilter = statusFilters.find(f => f.value === activeStatus);
      let saleType: "All" | "FIXEDPRICE" | "AUCTION" = defaultSaleType;
      if (activeStatus !== "all" && statusFilter) {
        saleType = statusFilter.apiValue as "All" | "FIXEDPRICE" | "AUCTION";
      }

      const payload = {
        saleType,
        edition: activeCategory as "All" | "Diamonds" | "Gold" | "Silver" | "Platinum" | "Sapphire",
        endingInDays: "Max",
        sortBy: "sortBy",
      };

      let response = await getTrendingProducts(payload);

      // Fallback: if no results with default sale type, try "All" and mark as sold out
      let showingSoldItems = false;
      if ((!response.data?.result || response.data.result.length === 0) && saleType !== "All") {
        const fallbackPayload = { ...payload, saleType: "All" as const };
        response = await getTrendingProducts(fallbackPayload);
        showingSoldItems = true;
      }

      setIsLoading(false);

      if (response.error) {
        console.error("Failed to fetch trending products:", response.error);
        setError(response.error);
        setProducts([]);
        return;
      }

      if (response.data?.result && response.data.result.length > 0) {
        // Map API response to local product format
        let resultProducts = response.data.result;
        
        // Filter out already sold items (those with firstSoldAt) unless we're showing sold items fallback
        if (!showingSoldItems) {
          resultProducts = resultProducts.filter((p: { firstSoldAt?: string }) => !p.firstSoldAt);
        }
        
        // Shuffle products if needed (for New Arrivals section to show different items)
        if (shuffleProducts && resultProducts.length > 4) {
          // Use a simple shuffle algorithm
          resultProducts = [...resultProducts].sort(() => Math.random() - 0.5);
        }
        
        const apiProducts = resultProducts.slice(0, 4).map((p) => {
          const normalized = normalizeProduct(p);
          return {
            ...normalized,
            image: normalized.image || getCategoryImage(normalized.category),
            isSoldOut: showingSoldItems,
          };
        });
        setProducts(apiProducts);
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [activeCategory, activeStatus, defaultSaleType, shuffleProducts]);


  return (
    <section className={`${reducedTopPadding ? 'pt-8 pb-20 lg:pt-12 lg:pb-32' : 'py-20 lg:py-32'} bg-background`}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
            {title}
          </h2>
        </motion.div>

        {/* Filters Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12"
        >
          {/* Category Tabs */}
          <div className="flex gap-2 md:gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm tracking-wider rounded-lg transition-all duration-300 disabled:opacity-50 ${
                  activeCategory === category
                    ? "bg-charcoal text-cream"
                    : "bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-charcoal"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Status Filter Dropdown - conditionally shown */}
          {showStatusFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-lg border-border gap-2 text-sm"
                  disabled={isLoading}
                >
                {statusFilters.find(f => f.value === activeStatus)?.label}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border z-50">
              {statusFilters.map((filter) => (
                <DropdownMenuItem 
                  key={filter.value}
                  onClick={() => setActiveStatus(filter.value)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    activeStatus === filter.value ? "bg-gold/10 text-gold" : ""
                  }`}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {error ? "Unable to load products. Please try again later." : "No data available"}
            </p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link to={`/category/${activeCategory.toLowerCase()}`}>
          <Button variant="premium-outline" size="lg" className="rounded-lg">
            View All Products
          </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
