import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingBag, Heart, X, Gavel, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryFilters, { FilterState, defaultFilterState } from "@/components/CategoryFilters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { allProducts, categoryDescriptions, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import ProductName from "@/components/ProductName";

const ITEMS_PER_PAGE = 20;

const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [bidModalProduct, setBidModalProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (product.status === "auction") {
      setBidModalProduct(product);
      return;
    }
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
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

  // Get all active filter tags
  const getActiveFilterTags = () => {
    const tags: { label: string; type: keyof FilterState; value?: string }[] = [];
    
    filters.selectedCuts.forEach(cut => tags.push({ label: cut, type: 'selectedCuts', value: cut }));
    filters.selectedColors.forEach(color => tags.push({ label: color, type: 'selectedColors', value: color }));
    filters.selectedClarity.forEach(clarity => tags.push({ label: clarity, type: 'selectedClarity', value: clarity }));
    filters.selectedStatus.forEach(status => tags.push({ label: status, type: 'selectedStatus', value: status }));
    filters.selectedSaleType.forEach(type => tags.push({ label: type, type: 'selectedSaleType', value: type }));
    
    if (filters.caratRange[0] !== 0.1 || filters.caratRange[1] !== 20) {
      tags.push({ label: `${filters.caratRange[0].toFixed(2)}-${filters.caratRange[1].toFixed(2)} ct`, type: 'caratRange' });
    }
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) {
      tags.push({ label: `$${filters.priceRange[0].toLocaleString()}-$${filters.priceRange[1].toLocaleString()}`, type: 'priceRange' });
    }
    
    return tags;
  };

  const removeFilterTag = (type: keyof FilterState, value?: string) => {
    if (type === 'caratRange') {
      setFilters({ ...filters, caratRange: [0.1, 20] });
    } else if (type === 'priceRange') {
      setFilters({ ...filters, priceRange: [0, 100000] });
    } else if (value) {
      const current = filters[type] as string[];
      setFilters({ ...filters, [type]: current.filter(item => item !== value) });
    }
  };

  const activeFilterTags = getActiveFilterTags();

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
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center justify-between">
                {/* Desktop Filter Toggle */}
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-full hidden lg:flex"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </Button>

                {/* Mobile/Tablet Filter Sheet */}
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2 rounded-full lg:hidden"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[350px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="font-playfair text-xl">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <CategoryFilters 
                        isOpen={true} 
                        onClose={() => setIsMobileFilterOpen(false)}
                        filters={filters}
                        onFiltersChange={setFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-muted-foreground text-sm">
                  Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              {/* Active Filter Tags */}
              {activeFilterTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilterTags.map((tag, index) => (
                    <span
                      key={`${tag.type}-${tag.value || index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-sm rounded-full border border-border/50"
                    >
                      {tag.label}
                      <button
                        onClick={() => removeFilterTag(tag.type, tag.value)}
                        className="hover:bg-muted rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setFilters(defaultFilterState)}
                    className="text-sm text-gold hover:text-gold/80 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Main Content with Filters and Products */}
            <div className="flex gap-8">
              {/* Filter Sidebar - Left Side */}
              {isFilterOpen && (
                <div className="hidden lg:block w-72 flex-shrink-0">
                  <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
                    <CategoryFilters 
                      isOpen={isFilterOpen} 
                      onClose={() => setIsFilterOpen(false)}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="flex-1">
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-12 ${isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                  {paginatedProducts.map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <motion.div
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
                          {/* Status Badge */}
                          {product.status && (
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
                          {/* Wishlist Button */}
                          <button 
                            onClick={(e) => handleWishlist(e, product)}
                            className={`absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background ${
                              isInWishlist(product.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-gold text-gold" : "text-foreground"}`} />
                          </button>
                          {/* Quick Add Button */}
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              onClick={(e) => handleAddToCart(e, product)}
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
                            <ProductName name={product.name} />
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
                    </Link>
                  ))}
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

      {/* Bid Modal */}
      <PlaceBidModal
        open={!!bidModalProduct}
        onOpenChange={(open) => !open && setBidModalProduct(null)}
        productName={bidModalProduct?.name}
        minimumBid={bidModalProduct ? Math.floor(bidModalProduct.price / 10) : 100}
        increment={1000}
        currency="LCX"
      />
    </div>
  );
};

export default Category;
