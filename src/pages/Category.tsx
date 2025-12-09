import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import PromotionalBoxes from "@/components/PromotionalBoxes";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

// Mock products data - in a real app this would come from an API
const allProducts = [
  { id: 1, name: "Classic Timepiece", price: 2450, image: product1, category: "watches" },
  { id: 2, name: "Elegant Chronograph", price: 3200, image: product2, category: "watches" },
  { id: 3, name: "Minimalist Watch", price: 1850, image: product3, category: "watches" },
  { id: 4, name: "Luxury Automatic", price: 4500, image: product4, category: "watches" },
  { id: 5, name: "Sport Diver Watch", price: 2800, image: product1, category: "watches" },
  { id: 6, name: "Vintage Collection", price: 3600, image: product2, category: "watches" },
  { id: 7, name: "Diamond Bezel", price: 5200, image: product3, category: "watches" },
  { id: 8, name: "Rose Gold Edition", price: 4100, image: product4, category: "watches" },
  { id: 9, name: "Titanium Pro", price: 2950, image: product1, category: "watches" },
  { id: 10, name: "Platinum Series", price: 6800, image: product2, category: "watches" },
  { id: 11, name: "Carbon Fiber", price: 3400, image: product3, category: "watches" },
  { id: 12, name: "Sapphire Crystal", price: 2750, image: product4, category: "watches" },
  { id: 13, name: "Silk Evening Dress", price: 1200, image: product1, category: "women" },
  { id: 14, name: "Cashmere Blazer", price: 890, image: product2, category: "women" },
  { id: 15, name: "Tailored Suit", price: 1450, image: product3, category: "men" },
  { id: 16, name: "Leather Loafers", price: 650, image: product4, category: "footwear" },
  { id: 17, name: "Gold Necklace", price: 2200, image: product1, category: "jewelry" },
  { id: 18, name: "Leather Belt", price: 320, image: product2, category: "accessories" },
];

const ITEMS_PER_PAGE = 8;

const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "All Products";

  // Filter products by category
  const filteredProducts = categoryName
    ? allProducts.filter(
        (p) => p.category.toLowerCase() === categoryName.toLowerCase()
      )
    : allProducts;

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[300px] md:h-[400px] bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />
          <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gold text-sm tracking-widest uppercase mb-4">
                Collection
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-4">
                {categoryTitle}
              </h1>
              <p className="text-cream/70 max-w-md">
                Discover our curated selection of premium {categoryTitle.toLowerCase()} crafted with exceptional quality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-12">
              <p className="text-muted-foreground">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] mb-4 overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground">
                    €{product.price.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* No Products */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Sections */}
        <Categories />
        <Services />
        <Newsletter />
        <PromotionalBoxes />
      </main>
      <Footer />
    </div>
  );
};

export default Category;
