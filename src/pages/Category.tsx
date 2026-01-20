import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryFilters, { FilterState, defaultFilterState } from "@/components/CategoryFilters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categoryDescriptions, Product } from "@/data/products";
import PlaceBidModal from "@/components/PlaceBidModal";
import { getAuthMarkets, buildAuthMarketsPayload, normalizeProduct, ApiTrendingProduct, AuthMarketsPayload, getConversionRate } from "@/lib/market-api";
import { PageSEO } from "@/components/shared/SEO";
import { CategoryHero, SaleTypeToggle, CategoryProductCard, Pagination } from "@/components/category";
import type { SaleTypeToggleType } from "@/components/category";

const ITEMS_PER_PAGE = 20;

// Extended product type for API products
type CategoryProduct = Product & { _id?: string; isSoldOut?: boolean };

const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  // Debounced filters for API calls (only updates after user stops dragging)
  const [debouncedFilters, setDebouncedFilters] = useState<FilterState>(defaultFilterState);
  const [bidModalProduct, setBidModalProduct] = useState<CategoryProduct | null>(null);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSaleType, setActiveSaleType] = useState<SaleTypeToggleType>("FIXEDPRICE");
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce range filters (caratRange and priceRange) - only update after user stops dragging
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check if range filters changed
    const rangeFiltersChanged = 
      filters.caratRange[0] !== debouncedFilters.caratRange[0] ||
      filters.caratRange[1] !== debouncedFilters.caratRange[1] ||
      filters.priceRange[0] !== debouncedFilters.priceRange[0] ||
      filters.priceRange[1] !== debouncedFilters.priceRange[1];

    // Check if non-range filters changed
    const nonRangeFiltersChanged = 
      JSON.stringify(filters.selectedCuts) !== JSON.stringify(debouncedFilters.selectedCuts) ||
      JSON.stringify(filters.selectedColors) !== JSON.stringify(debouncedFilters.selectedColors) ||
      JSON.stringify(filters.selectedClarity) !== JSON.stringify(debouncedFilters.selectedClarity) ||
      JSON.stringify(filters.selectedStatus) !== JSON.stringify(debouncedFilters.selectedStatus) ||
      JSON.stringify(filters.selectedSaleType) !== JSON.stringify(debouncedFilters.selectedSaleType);

    if (rangeFiltersChanged) {
      // Debounce range filters - wait 500ms after user stops dragging
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedFilters(filters);
      }, 500);
    } else if (nonRangeFiltersChanged) {
      // Non-range filters update immediately (checkboxes, etc.)
      setDebouncedFilters(filters);
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch products from API (uses debounced filters)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) return;

      setIsLoading(true);
      setError(null);

      // Build payload with current filters based on category
      const slug = categoryName.toLowerCase();
      
      // Use the active sale type toggle
      // For "REDEEMED", we use saleType "ALL" but add status filter
      const saleType: "ALL" | "FIXEDPRICE" | "AUCTION" = activeSaleType === "REDEEMED" ? "ALL" : activeSaleType;

      const baseFilters: Partial<AuthMarketsPayload> = {
        priceRangeMin: debouncedFilters.priceRange[0] || 1,
        priceRangeMax: debouncedFilters.priceRange[1],
        saleType,
        // Add Redeemed status filter when REDEEMED is selected
        ...(activeSaleType === "REDEEMED" && { status: ["Redeemed"] }),
      };

      // Add category-specific filters
      if (slug === "diamonds") {
        baseFilters.minCarat = debouncedFilters.caratRange[0];
        baseFilters.maxCarat = debouncedFilters.caratRange[1];
        baseFilters.cut = debouncedFilters.selectedCuts;
        baseFilters.clarity = debouncedFilters.selectedClarity;
      } else if (slug === "sapphire") {
        baseFilters.minCarat = debouncedFilters.caratRange[0];
        baseFilters.maxCarat = debouncedFilters.caratRange[1];
        baseFilters.cut = debouncedFilters.selectedCuts;
      }

      const payload = buildAuthMarketsPayload(categoryName, currentPage, baseFilters);

      const response = await getAuthMarkets(payload);

      setIsLoading(false);

      if (response.error) {
        console.error("Failed to fetch products:", response.error);
        setError(response.error);
        setProducts([]);
        setTotalCount(0);
        return;
      }

      if (response.data?.result && response.data.result.length > 0) {
        // Don't filter out sold items - just mark them as sold
        const apiProducts = response.data.result.map((p: ApiTrendingProduct) => {
          const normalized = normalizeProduct(p);
          // Mark as sold out if saleType is NOSALE OR if firstSoldAt is present
          const isSoldOut = p.saleType === "NOSALE" || !!p.firstSoldAt;
          return {
            ...normalized,
            id: normalized.id,
            _id: normalized._id,
            isSoldOut,
          } as CategoryProduct;
        });
        setProducts(apiProducts);
        
        // Determine if there's a next page based on whether we got a full page
        const gotFullPage = apiProducts.length >= ITEMS_PER_PAGE;
        setHasNextPage(gotFullPage);
        
        // Set a reasonable total count for display purposes
        if (gotFullPage) {
          // We have more pages - set total based on current position
          setTotalCount((currentPage + 1) * ITEMS_PER_PAGE);
        } else {
          // This is the last page
          const exactTotal = (currentPage - 1) * ITEMS_PER_PAGE + apiProducts.length;
          setTotalCount(exactTotal);
        }
    } else {
        // Empty results
        if (currentPage > 1) {
          // We're past the last page - this shouldn't happen with the new design
          // but just in case, go back one page
          setCurrentPage(currentPage - 1);
          return;
        }
        setProducts([]);
        setTotalCount(0);
        setHasNextPage(false);
      }
    };

    fetchProducts();
  }, [categoryName, currentPage, debouncedFilters, activeSaleType]);

  // Reset to page 1 and scroll to top when category changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [categoryName]);

  // Reset to page 1 when sale type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSaleType]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  // Fetch conversion rates for Diamonds collection
  useEffect(() => {
    const fetchRates = async () => {
      if (categoryName?.toLowerCase() === "diamonds") {
        const coins = ["LCX", "USDT", "USDC", "WETH"];
        const rates: Record<string, number> = {};
        
        for (const coin of coins) {
          const response = await getConversionRate(coin, 1);
          if (response.data?.result?.USD) {
            rates[coin] = response.data.result.USD;
          }
        }
        
        setConversionRates(rates);
      }
    };
    fetchRates();
  }, [categoryName]);

  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()
    : "Collection";

  const categoryDescription = categoryName 
    ? categoryDescriptions[categoryName.toLowerCase() as keyof typeof categoryDescriptions] || 
      "Explore our exquisite collection of premium pieces."
    : "Explore our exquisite collection of premium pieces.";

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Filter tags for display
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
      <PageSEO.Category name={categoryTitle} />
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Banner */}
        <CategoryHero title={categoryTitle} description={categoryDescription} />

        {/* Products Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 mb-10">
              {/* 3-column layout: Left (filters) | Center (sale type) | Right (product count) */}
              <div className="grid grid-cols-3 items-center gap-4">
                {/* Left - Filter Toggle */}
                <div className="flex items-center gap-4 flex-shrink-0">
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
                        <SheetTitle className="font-serif text-xl font-light">Filters</SheetTitle>
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
                </div>

                {/* Center - Sale Type Toggle (Desktop) */}
                <div className="flex justify-center hidden lg:flex">
                  <SaleTypeToggle 
                    activeSaleType={activeSaleType}
                    onSaleTypeChange={setActiveSaleType}
                  />
                </div>

                {/* Right - Product Count */}
                <div className="flex justify-end">
                <p className="text-muted-foreground text-sm whitespace-nowrap">
                    <span className="text-foreground font-medium">{totalCount.toLocaleString()}</span> products
                </p>
                </div>
              </div>

              {/* Mobile Filter Row */}
              <div className="lg:hidden">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {/* All Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSaleType("ALL")}
                    className={`whitespace-nowrap font-medium h-10 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      activeSaleType === "ALL"
                        ? "bg-foreground text-background"
                        : "bg-transparent border border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    All
                  </button>

                  {/* On Sale Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSaleType("FIXEDPRICE")}
                    className={`whitespace-nowrap font-medium h-10 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      activeSaleType === "FIXEDPRICE"
                        ? "bg-foreground text-background"
                        : "bg-transparent border border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    On Sale
                  </button>

                  {/* Auction Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSaleType("AUCTION")}
                    className={`whitespace-nowrap font-medium h-10 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      activeSaleType === "AUCTION"
                        ? "bg-foreground text-background"
                        : "bg-transparent border border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    Auction
                  </button>

                  {/* Redeemed Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSaleType("REDEEMED")}
                    className={`whitespace-nowrap font-medium h-10 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      activeSaleType === "REDEEMED"
                        ? "bg-foreground text-background"
                        : "bg-transparent border border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    Redeemed
                  </button>
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFilterTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {activeFilterTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => removeFilterTag(tag.type, tag.value)}
                      className="flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs rounded-full hover:bg-gold/20 transition-colors"
                    >
                      {tag.label}
                      <X className="w-3 h-3" />
                      </button>
                  ))}
                  <button
                    onClick={() => setFilters(defaultFilterState)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className={`flex gap-8 ${isFilterOpen ? '' : ''}`}>
              {/* Desktop Filters Sidebar */}
              {isFilterOpen && (
                <div className="hidden lg:block w-[280px] flex-shrink-0">
                  <div className="sticky top-28">
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
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                      Unable to load products. Please try again later.
                    </p>
                            </div>
                          )}

                {/* Empty State */}
                {!isLoading && !error && products.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                      No data available
                    </p>
                  </div>
                )}

                {/* Products */}
                {!isLoading && !error && products.length > 0 && (
                  <>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-12 ${isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                      {products.map((product, index) => (
                        <CategoryProductCard
                          key={product._id || product.id}
                          product={product}
                          index={index}
                          categoryName={categoryName}
                          conversionRates={conversionRates}
                          onPlaceBid={setBidModalProduct}
                        />
                  ))}
                </div>

                    {/* Pagination */}
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Bid Modal */}
      <PlaceBidModal
        open={!!bidModalProduct}
        onOpenChange={(open) => !open && setBidModalProduct(null)}
        productName={bidModalProduct?.name}
        minimumBid={bidModalProduct ? Math.floor(bidModalProduct.price / 10) : 0}
        increment={1000}
        currency="LCX"
      />
    </div>
  );
};

export default Category;
