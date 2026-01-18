import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Gavel, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import ProductName from "@/components/ProductName";
import { Product } from "@/data/products";

type CategoryProduct = Product & { _id?: string; isSoldOut?: boolean };

interface CategoryProductCardProps {
  product: CategoryProduct;
  index: number;
  categoryName?: string;
  conversionRates: Record<string, number>;
  onPlaceBid: (product: CategoryProduct) => void;
}

const CategoryProductCard = ({ 
  product, 
  index, 
  categoryName, 
  conversionRates,
  onPlaceBid 
}: CategoryProductCardProps) => {
  const { addToCart, isInCart, hasItemInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const alreadyInCart = isInCart(product.id);
  const cartIsFull = hasItemInCart() && !alreadyInCart; // Cart has item but not this one

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.status === "auction") {
      onPlaceBid(product);
      return;
    }
    // addToCart now returns false and shows error toast if already in cart
    const success = addToCart(product);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const getDisplayPrice = () => {
    const coin = product.pricePerUnit?.toUpperCase();
    const rate = conversionRates[coin];
    const isDiamonds = categoryName?.toLowerCase() === "diamonds";
    const canConvert = isDiamonds && rate && coin && coin !== "USD";
    
    if (canConvert) {
      return `$${(product.price * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${product.price.toLocaleString()}`;
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      state={{ product }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.02 }}
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
          {product.isSoldOut ? (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 bg-charcoal/90 text-cream border border-cream/20">
              <Check className="w-3.5 h-3.5" />
              Sold
            </div>
          ) : product.status && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              product.status === "auction" 
                ? "bg-gold/90 text-charcoal" 
                : "bg-charcoal/90 text-cream"
            }`}>
              {product.status === "auction" ? (
                <>
                  <Gavel className="w-3.5 h-3.5" />
                  Auction
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5" />
                  On Sale
                </>
              )}
            </div>
          )}
          {/* In Cart Badge */}
          {alreadyInCart && !product.isSoldOut && (
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-[10px] font-medium bg-green-500 text-white opacity-100">
              In Cart
            </div>
          )}
          {/* Wishlist Button */}
          {!alreadyInCart && (
            <button 
              onClick={handleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background ${
                isInWishlist(product.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-gold text-gold" : "text-foreground"}`} />
            </button>
          )}
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
                className="w-full bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg gap-2 cursor-default opacity-100"
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
                Add to Cart
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
              {getDisplayPrice()}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryProductCard;

