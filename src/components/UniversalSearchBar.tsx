import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchMarketplace, SearchEdition, SearchTiamond } from "@/lib/market-api";

// Collection suggestions - clean, no emojis
const collectionSuggestions = [
  { name: "Diamonds", slug: "diamonds" },
  { name: "Gold", slug: "gold" },
  { name: "Silver", slug: "silver" },
  { name: "Platinum", slug: "platinum" },
  { name: "Sapphire", slug: "sapphire" },
];

interface UniversalSearchBarProps {
  className?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const UniversalSearchBar = ({ className }: UniversalSearchBarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editions, setEditions] = useState<SearchEdition[]>([]);
  const [tiamonds, setTiamonds] = useState<SearchTiamond[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setEditions([]);
        setTiamonds([]);
        return;
      }

      setIsLoading(true);
      
      const response = await searchMarketplace(debouncedQuery);
      
      setIsLoading(false);

      if (response.data?.result) {
        setEditions(response.data.result.editionsList || []);
        setTiamonds((response.data.result.tiamondsList || []).slice(0, 10));
      } else {
        setEditions([]);
        setTiamonds([]);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectCollection = useCallback((slug: string) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/category/${slug}`);
  }, [navigate]);

  const handleSelectEdition = useCallback((edition: SearchEdition) => {
    const categoryMap: Record<string, string> = {
      "diamonds": "diamonds",
      "diamond": "diamonds",
      "gold": "gold",
      "silver": "silver",
      "platinum": "platinum",
      "sapphire": "sapphire",
    };

    const category = categoryMap[edition.smallName?.toLowerCase()] || 
                     categoryMap[edition.editionCategory?.toLowerCase()] ||
                     edition.smallName?.toLowerCase() ||
                     "diamonds";

    setQuery("");
    setIsOpen(false);
    navigate(`/category/${category}`);
  }, [navigate]);

  const handleSelectTiamond = useCallback((tiamond: SearchTiamond) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/product/${tiamond.tokenId}`);
  }, [navigate]);

  const handleClear = () => {
    setQuery("");
    setEditions([]);
    setTiamonds([]);
    inputRef.current?.focus();
  };

  const hasSearchResults = editions.length > 0 || tiamonds.length > 0;
  const isSearching = query.length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search assets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-10 w-full bg-muted/50 border-border/50 focus:bg-background rounded-full font-sans text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50"
          >
            <div 
              className="py-2 max-h-[320px] overflow-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Default: Show Collection Suggestions */}
              {!isLoading && !isSearching && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Browse Collections
                  </p>
                  {collectionSuggestions.map((collection) => (
                    <button
                      key={collection.slug}
                      onClick={() => handleSelectCollection(collection.slug)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm text-foreground">{collection.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {!isLoading && isSearching && (
                <>
                  {/* No Results */}
                  {!hasSearchResults && (
                    <p className="text-center text-muted-foreground text-sm py-6">
                      No results for "{query}"
                    </p>
                  )}

                  {/* Editions */}
                  {editions.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Collections
                      </p>
                      {editions.map((edition) => (
                        <button
                          key={edition.uri || edition.name}
                          onClick={() => handleSelectEdition(edition)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img 
                              src={edition.assetUrl || edition.smallImageLink || edition.imageLink} 
                              alt={edition.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="text-sm text-foreground">{edition.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tiamonds (Products) */}
                  {tiamonds.length > 0 && (
                    <div className={editions.length > 0 ? "mt-2 pt-2 border-t border-border/50" : ""}>
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Products
                      </p>
                      {tiamonds.map((tiamond) => (
                        <button
                          key={tiamond.tokenId}
                          onClick={() => handleSelectTiamond(tiamond)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img 
                              src={tiamond.assetUrl || tiamond.smallImageLink || tiamond.image} 
                              alt={tiamond.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-foreground block truncate">{tiamond.name}</span>
                            <span className="text-xs text-muted-foreground">${tiamond.usdPrice?.toFixed(0) || tiamond.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversalSearchBar;
