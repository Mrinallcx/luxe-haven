import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Gavel, Tag, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ProductName from "@/components/ProductName";
import { Product } from "@/data/products";

interface RelatedProductsProps {
  products: Product[];
  categoryLabel: string;
  currentCategory: string;
}

const RelatedProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
        </div>
      </Link>
    </motion.div>
  );
};

const RelatedProducts = ({ products, categoryLabel, currentCategory }: RelatedProductsProps) => {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-light text-foreground">Related Products</h2>
        <Link 
          to={`/category/${currentCategory}`}
          className="text-sm text-gold hover:text-gold/80 transition-colors"
        >
          View All {categoryLabel}
        </Link>
      </div>
      
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-4 basis-4/5">
                <RelatedProductCard product={product} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-background/80 border-border" />
          <CarouselNext className="right-2 bg-background/80 border-border" />
        </Carousel>
      </div>

      {/* Tablet Carousel */}
      <div className="hidden md:block lg:hidden">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/3">
                <RelatedProductCard product={product} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-background/80 border-border" />
          <CarouselNext className="right-2 bg-background/80 border-border" />
        </Carousel>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <RelatedProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;

