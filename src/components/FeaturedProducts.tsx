import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
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
  },
];

const categories = ["All", "Diamonds", "Gold", "Silver", "Platinum", "Sapphire"];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  return (
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
        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
          <Heart className="w-5 h-5 text-foreground" />
        </button>
        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="w-full bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg gap-2">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium bg-gold/10 text-gold px-2.5 py-1 rounded-full">
            {product.purity}
          </span>
          <span className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
            {product.weight}
          </span>
        </div>
        
        <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-foreground">
            €{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.pricePerUnit}
          </span>
        </div>
      </div>
    </motion.article>
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
  
  const filteredProducts = activeCategory === "All" 
    ? products.slice(0, 4) 
    : products.filter(p => p.category === activeCategory).slice(0, 4);

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

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-start gap-2 md:gap-4 mb-12 flex-wrap"
        >
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
