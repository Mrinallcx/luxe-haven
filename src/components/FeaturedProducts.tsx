import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  {
    id: 1,
    name: "Classic Leather Watch",
    brand: "Maison Timepieces",
    price: 2450,
    image: product1,
    category: "Watches",
  },
  {
    id: 2,
    name: "Silk Cashmere Scarf",
    brand: "Atelier Luxe",
    price: 890,
    image: product2,
    category: "Accessories",
  },
  {
    id: 3,
    name: "Artisan Tote Bag",
    brand: "Maison Leather",
    price: 1890,
    image: product3,
    category: "Bags",
  },
  {
    id: 4,
    name: "Gold Bangle Bracelet",
    brand: "Orné Jewelry",
    price: 1250,
    image: product4,
    category: "Jewelry",
  },
  {
    id: 5,
    name: "Platinum Chronograph",
    brand: "Maison Timepieces",
    price: 3200,
    image: product1,
    category: "Watches",
  },
  {
    id: 6,
    name: "Leather Crossbody",
    brand: "Maison Leather",
    price: 1450,
    image: product3,
    category: "Bags",
  },
  {
    id: 7,
    name: "Diamond Pendant",
    brand: "Orné Jewelry",
    price: 2890,
    image: product4,
    category: "Jewelry",
  },
  {
    id: 8,
    name: "Wool Blend Scarf",
    brand: "Atelier Luxe",
    price: 450,
    image: product2,
    category: "Accessories",
  },
];

const categories = ["All", "Watches", "Bags", "Jewelry", "Accessories"];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300" />
        
        <button
          className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button variant="premium-light" className="w-full">
            Add to Bag
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          {product.brand}
        </p>
        <h3 className="font-serif text-lg">{product.name}</h3>
        <p className="text-sm font-medium">${product.price.toLocaleString()}</p>
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
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {subtitle}
          </p>
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
          className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm tracking-wider transition-all duration-300 ${
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
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
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
          <Button variant="premium-outline" size="lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;