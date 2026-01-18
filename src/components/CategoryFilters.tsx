import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export const cutOptions = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
export const colorOptions = ["Natural", "Coloured"];
export const clarityOptions = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
// Status and Sale Type filters removed - now handled by top toggle buttons

export interface FilterState {
  selectedCuts: string[];
  selectedColors: string[];
  selectedClarity: string[];
  caratRange: number[];
  priceRange: number[];
  selectedStatus: string[];
  selectedSaleType: string[];
}

export const defaultFilterState: FilterState = {
  selectedCuts: [],
  selectedColors: [],
  selectedClarity: [],
  caratRange: [0.1, 20],
  priceRange: [0, 100000],
  selectedStatus: [],
  selectedSaleType: [],
};

interface CategoryFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true, isLast = false }: FilterSectionProps & { isLast?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={isLast ? "py-4" : "border-b border-border/50 py-4"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-foreground">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

const CategoryFilters = ({ isOpen, onClose, filters, onFiltersChange }: CategoryFiltersProps) => {
  const filterBoxRef = useRef<HTMLDivElement>(null);

  const toggleOption = (
    option: string,
    key: keyof Pick<FilterState, 'selectedCuts' | 'selectedColors' | 'selectedClarity' | 'selectedStatus' | 'selectedSaleType'>
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange(defaultFilterState);
  };

  const hasActiveFilters = 
    filters.selectedCuts.length > 0 ||
    filters.selectedColors.length > 0 ||
    filters.selectedClarity.length > 0 ||
    filters.caratRange[0] !== 0.1 ||
    filters.caratRange[1] !== 20 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100000;

  // Handle wheel events to prevent Lenis from intercepting
  useEffect(() => {
    const filterBox = filterBoxRef.current;
    if (!filterBox) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = filterBox;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      // If we can scroll in the direction of the wheel, stop propagation to prevent Lenis
      if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
        e.stopPropagation();
        e.preventDefault();
        // Manually scroll the element
        filterBox.scrollTop += e.deltaY;
      }
    };

    filterBox.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      filterBox.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div
      ref={filterBoxRef}
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-6 transition-all duration-300 overflow-y-auto max-h-[calc(100vh-8rem)] filter-scroll",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none hidden"
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
      }}
    >
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
        <h3 className="font-serif text-lg font-light text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gold hover:text-gold/80 hover:bg-gold/10 text-sm"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Cut Filter */}
      <FilterSection title="Cut">
        <div className="grid grid-cols-2 gap-2">
          {cutOptions.map((cut) => (
            <label
              key={cut}
              className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={filters.selectedCuts.includes(cut)}
                onCheckedChange={() => toggleOption(cut, 'selectedCuts')}
              />
              {cut}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="grid grid-cols-2 gap-2">
          {colorOptions.map((color) => (
            <label
              key={color}
              className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={filters.selectedColors.includes(color)}
                onCheckedChange={() => toggleOption(color, 'selectedColors')}
              />
              {color}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clarity Filter */}
      <FilterSection title="Clarity">
        <div className="grid grid-cols-2 gap-2">
          {clarityOptions.map((clarity) => (
            <label
              key={clarity}
              className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={filters.selectedClarity.includes(clarity)}
                onCheckedChange={() => toggleOption(clarity, 'selectedClarity')}
              />
              {clarity}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Carat Range */}
      <FilterSection title="Carat">
        <div className="space-y-4">
          <Slider
            value={filters.caratRange}
            onValueChange={(value) => onFiltersChange({ ...filters, caratRange: value })}
            min={0.1}
            max={20}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.caratRange[0].toFixed(2)} ct</span>
            <span>{filters.caratRange[1].toFixed(2)} ct</span>
          </div>
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price" isLast={true}>
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            min={0}
            max={100000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0].toLocaleString()}</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

    </div>
  );
};

export default CategoryFilters;
