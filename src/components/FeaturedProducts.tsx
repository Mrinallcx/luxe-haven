import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Gavel, Tag, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  {
    id: 1,
    name: "Round Brilliant Diamond",
    price: 12500,
    pricePerUnit: "per carat",
    image: product1,
    category: "Diamonds",
    purity: "VVS1",
    weight: "1.5 ct",
    status: "sale" as const,
  },
  {
    id: 2,
    name: "24K Gold Bar",
    price: 5890,
    pricePerUnit: "per 100g",
    image: product2,
    category: "Gold",
    purity: "999.9",
    weight: "100g",
    status: "auction" as const,
  },
  {
    id: 3,
    name: "999 Silver Bar",
    price: 890,
    pricePerUnit: "per 1kg",
    image: product3,
    category: "Silver",
    purity: "999",
    weight: "1kg",
    status: "sale" as const,
  },
  {
    id: 4,
    name: "Platinum Bar",
    price: 4200,
    pricePerUnit: "per 100g",
    image: product4,
    category: "Platinum",
    purity: "999.5",
    weight: "100g",
    status: "auction" as const,
  },
  {
    id: 5,
    name: "Ceylon Sapphire",
    price: 12000,
    pricePerUnit: "per carat",
    image: product1,
    category: "Sapphire",
    purity: "AAA+",
    weight: "3.0 ct",
    status: "sale" as const,
  },
  {
    id: 6,
    name: "Princess Cut Diamond",
    price: 9800,
    pricePerUnit: "per carat",
    image: product3,
    category: "Diamonds",
    purity: "VS1",
    weight: "1.2 ct",
    status: "auction" as const,
  },
  {
    id: 7,
    name: "Gold Krugerrand",
    price: 1950,
    pricePerUnit: "per oz",
    image: product4,
    category: "Gold",
    purity: "916",
    weight: "1 oz",
    status: "sale" as const,
  },
  {
    id: 8,
    name: "Star Sapphire",
    price: 15000,
    pricePerUnit: "per carat",
    image: product2,
    category: "Sapphire",
    purity: "AAA+",
    weight: "4.0 ct",
    status: "auction" as const,
  },
];

const categories = ["All", "Diamonds", "Gold", "Silver", "Platinum", "Sapphire"];
const statusFilters = [
  { value: "all", label: "All", icon: null },
  { value: "sale", label: "On Sale", icon: Tag },
  { value: "auction", label: "Auction", icon: Gavel },
];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

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
    <Link to={`/product/${product.id}`}>
      <motion.article
        layout
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg"
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
          {/* Quick Add Button */}
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
        </div>
        
        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-foreground">
              €{product.price.toLocaleString()}
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
      increment={Math.floor(product.price / 100)}
      currency="LCX"
    />
    </>
  );
};

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
}

const FeaturedProducts = ({ 
  title = "Featured Pieces", 
  subtitle = "Curated Selection" 
}: FeaturedProductsProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all");
  
  const filteredProducts = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => activeStatus === "all" || p.status === activeStatus)
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
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
                className={`px-4 py-2 text-sm tracking-wider rounded-lg transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-charcoal text-cream"
                    : "bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-charcoal"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-lg border-border gap-2 text-sm"
              >
                {statusFilters.find(f => f.value === activeStatus)?.icon && (
                  (() => {
                    const Icon = statusFilters.find(f => f.value === activeStatus)?.icon;
                    return Icon ? <Icon className="w-4 h-4" /> : null;
                  })()
                )}
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
                  {filter.icon && <filter.icon className="w-4 h-4" />}
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <Button variant="premium-outline" size="lg" className="rounded-lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
