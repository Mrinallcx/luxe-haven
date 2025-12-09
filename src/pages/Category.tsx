import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingBag, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryFilters from "@/components/CategoryFilters";
import { Button } from "@/components/ui/button";
import { allProducts, categoryDescriptions } from "@/data/products";

const ITEMS_PER_PAGE = 20;

const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "All Products";

  const categoryDescription = categoryName 
    ? categoryDescriptions[categoryName.toLowerCase()] || `Explore our premium ${categoryTitle.toLowerCase()} collection.`
    : "Browse all our premium assets and investments.";

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
      <main className="pt-16 lg:pt-20">
        {/* Hero Banner */}
        <section className="relative h-[280px] md:h-[360px] bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />
          <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gold text-sm tracking-widest uppercase mb-4">
                Premium Collection
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-4">
                {categoryTitle}
              </h1>
              <p className="text-cream/70 max-w-lg text-sm md:text-base">
                {categoryDescription}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-10">
              <p className="text-muted-foreground text-sm">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <Button 
                variant="outline" 
                className="gap-2 rounded-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Main Content with Products and Filters */}
            <div className="flex gap-8">
              {/* Products Grid */}
              <div className={`flex-1 transition-all duration-300 ${isFilterOpen ? 'lg:pr-0' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.02 }}
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
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Filter Sidebar - Right Side */}
              <div className={`hidden lg:block w-72 flex-shrink-0 transition-all duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                <div className="sticky top-24">
                  <CategoryFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
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
                    className="rounded-lg"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
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
      </main>
      <Footer />
    </div>
  );
};

export default Category;
