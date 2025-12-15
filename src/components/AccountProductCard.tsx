import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2, Gavel, Tag } from "lucide-react";
import { Product } from "@/data/products";

interface AccountProductCardProps {
  product: Product;
  index: number;
  viewMode: "grid" | "list";
  variant?: "owned" | "bid" | "wishlist";
  bidData?: {
    bidAmount: number;
    currentBid: number;
    status: string;
    date: string;
  };
  onRemove?: () => void;
  onListForSale?: () => void;
}

const AccountProductCard = ({
  product,
  index,
  viewMode,
  variant = "owned",
  bidData,
  onRemove,
  onListForSale,
}: AccountProductCardProps) => {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="bg-muted/20 border-border hover:border-gold/50 transition-all">
          <CardContent className="p-4 flex items-center gap-4">
            <Link to={`/product/${product.id}`} className="shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <div className="flex-1 min-w-0">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-medium text-foreground hover:text-gold transition-colors truncate">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{product.purity}</span>
                <span>•</span>
                <span>{product.weight}</span>
              </div>
              {bidData && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted-foreground">
                    Your Bid: <span className="text-foreground">${bidData.bidAmount.toLocaleString()}</span>
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    bidData.status === "Winning" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {bidData.status}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-gold">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{product.pricePerUnit}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {variant === "wishlist" && onRemove && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-red-500"
                  onClick={(e) => { e.preventDefault(); onRemove(); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {variant === "bid" && (
                <Button
                  size="sm"
                  className="rounded-full bg-gold/10 text-gold border border-gold hover:bg-gold hover:text-charcoal"
                >
                  <Gavel className="w-4 h-4 mr-1" />
                  Update Bid
                </Button>
              )}
              {variant === "owned" && onListForSale && (
                <Button
                  size="sm"
                  className="rounded-full bg-gold text-charcoal hover:bg-gold/90"
                  onClick={(e) => { e.preventDefault(); onListForSale(); }}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  List for Sale
                </Button>
              )}
              {variant === "wishlist" && (
                <Button
                  size="sm"
                  className="rounded-full bg-charcoal text-cream hover:bg-charcoal/90"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Buy
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Link to={`/product/${product.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {variant === "wishlist" && onRemove && (
            <button
              onClick={(e) => { e.preventDefault(); onRemove(); }}
              className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"
            >
              <Heart className="w-4 h-4 fill-current text-red-500" />
            </button>
          )}
          
          
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {variant === "owned" && onListForSale ? (
                <Button
                  onClick={(e) => { e.preventDefault(); onListForSale(); }}
                  className="w-full bg-gold hover:bg-gold/90 text-charcoal rounded-lg gap-2 text-sm"
                >
                  <Tag className="w-4 h-4" />
                  List for Sale
                </Button>
              ) : variant === "wishlist" ? (
                <Button
                  onClick={(e) => e.preventDefault()}
                  className="w-full bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                </Button>
              ) : null}
            </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-1 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>{product.purity}</span>
            <span>•</span>
            <span>{product.weight}</span>
          </div>
          
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-gold">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.pricePerUnit}
            </span>
          </div>
          
          {bidData && (
            <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Your Bid: <span className="text-foreground font-medium">${bidData.bidAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
};

export default AccountProductCard;
