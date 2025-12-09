import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Clock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchSuggestion {
  label: string;
  type: "trending" | "recent" | "category";
  icon: typeof TrendingUp;
}

const predefinedSuggestions: SearchSuggestion[] = [
  { label: "Summer Collection", type: "trending", icon: TrendingUp },
  { label: "Linen Dresses", type: "trending", icon: TrendingUp },
  { label: "Designer Handbags", type: "trending", icon: TrendingUp },
  { label: "Gold Jewelry", type: "recent", icon: Clock },
  { label: "Silk Scarves", type: "recent", icon: Clock },
  { label: "Women's Clothing", type: "category", icon: Tag },
  { label: "Men's Accessories", type: "category", icon: Tag },
  { label: "Footwear", type: "category", icon: Tag },
];

interface UniversalSearchBarProps {
  className?: string;
}

const UniversalSearchBar = ({ className }: UniversalSearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = query
    ? predefinedSuggestions.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )
    : predefinedSuggestions;

  const groupedSuggestions = {
    trending: filteredSuggestions.filter((s) => s.type === "trending"),
    recent: filteredSuggestions.filter((s) => s.type === "recent"),
    category: filteredSuggestions.filter((s) => s.type === "category"),
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (label: string) => {
    setQuery(label);
    setIsOpen(false);
    // Here you would typically trigger the search
    console.log("Searching for:", label);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 h-10 w-full bg-muted/50 border-border/50 focus:bg-background rounded-full font-sans text-sm"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {groupedSuggestions.trending.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 px-2">
                    Trending
                  </h4>
                  <div className="space-y-1">
                    {groupedSuggestions.trending.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSelect(suggestion.label)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-gold" />
                        <span className="font-sans text-sm">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedSuggestions.recent.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 px-2">
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {groupedSuggestions.recent.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSelect(suggestion.label)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-sans text-sm">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedSuggestions.category.length > 0 && (
                <div>
                  <h4 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 px-2">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    {groupedSuggestions.category.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSelect(suggestion.label)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <Tag className="w-4 h-4 text-charcoal" />
                        <span className="font-sans text-sm">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredSuggestions.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4 font-sans">
                  No results found for "{query}"
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversalSearchBar;
