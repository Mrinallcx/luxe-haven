import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const cutOptions = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
export const colorOptions = ["Natural", "Coloured"];
export const clarityOptions = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
export const statusOptions = ["Redeemed"];
export const saleTypeOptions = ["Fixed", "Auction"];

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

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 py-4">
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
    filters.selectedStatus.length > 0 ||
    filters.selectedSaleType.length > 0 ||
    filters.caratRange[0] !== 0.1 ||
    filters.caratRange[1] !== 20 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100000;

  return (
    <div
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-6 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none hidden"
      )}
    >
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
        <h3 className="font-playfair text-lg font-semibold text-foreground">Filters</h3>
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
        <div className="flex flex-col gap-2">
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
      <FilterSection title="Price">
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

      {/* Status Filter */}
      <FilterSection title="Status">
        <div className="flex flex-col gap-2">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={filters.selectedStatus.includes(status)}
                onCheckedChange={() => toggleOption(status, 'selectedStatus')}
              />
              {status}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sale Type Filter */}
      <FilterSection title="Sale Type">
        <div className="flex flex-col gap-2">
          {saleTypeOptions.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={filters.selectedSaleType.includes(type)}
                onCheckedChange={() => toggleOption(type, 'selectedSaleType')}
              />
              {type}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default CategoryFilters;
