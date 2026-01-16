import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Gavel, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import ProductName from "@/components/ProductName";

export interface ProductCardData {
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
  isSoldOut?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
  showAnimation?: boolean;
  conversionRate?: number;
  showConvertedPrice?: boolean;
}

/**
 * Reusable product card component for displaying products across the app
 */
const ProductCard = ({
  product,
  index = 0,
  showAnimation = true,
  conversionRate,
  showConvertedPrice = false,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.status === "auction") {
      setIsBidModalOpen(true);
      return;
    }
    addToCart({
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
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
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
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (product.isSoldOut) {
      e.preventDefault();
    }
  };

  // Calculate display price
  const getDisplayPrice = () => {
    if (showConvertedPrice && conversionRate && product.pricePerUnit !== "USD") {
      return `$${(product.price * conversionRate).toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    return `$${product.price.toLocaleString()}`;
  };

  const cardContent = (
    <motion.article
      layout={showAnimation}
      initial={showAnimation ? { opacity: 0, y: 40 } : undefined}
      animate={showAnimation ? { opacity: 1, y: 0 } : undefined}
      exit={showAnimation ? { opacity: 0, y: 20 } : undefined}
      transition={showAnimation ? { duration: 0.4, delay: index * 0.05 } : undefined}
      className={`group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 ${
        product.isSoldOut 
          ? "opacity-75 cursor-not-allowed" 
          : "hover:border-gold/30 hover:shadow-lg"
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            product.isSoldOut ? "grayscale" : "group-hover:scale-105"
          }`}
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {product.isSoldOut ? (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 bg-gray-500/90 text-white">
              Sold Out
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
        {!product.isSoldOut && (
          <button 
            onClick={handleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background ${
              inWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-gold text-gold" : "text-foreground"}`} />
          </button>
        )}

        {/* Quick Add Button */}
        {!product.isSoldOut && (
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          </div>
        )}
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
    </motion.article>
  );

  return (
    <>
      <Link 
        to={product.isSoldOut ? "#" : `/product/${product.id}`}
        onClick={handleLinkClick}
        aria-label={`View ${product.name}`}
      >
        {cardContent}
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

export default ProductCard;

