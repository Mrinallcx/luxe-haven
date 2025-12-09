import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const cutOptions = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
const colorOptions = ["Natural", "Coloured"];
const clarityOptions = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
const statusOptions = ["Redeemed"];
const saleTypeOptions = ["Fixed", "Auction"];

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

const CategoryFilters = ({ isOpen, onClose }: CategoryFiltersProps) => {
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [caratRange, setCaratRange] = useState<number[]>([0.1, 20]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedSaleType, setSelectedSaleType] = useState<string[]>([]);

  const toggleOption = (
    option: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCuts([]);
    setSelectedColors([]);
    setSelectedClarity([]);
    setCaratRange([0.1, 20]);
    setPriceRange([0, 100000]);
    setSelectedStatus([]);
    setSelectedSaleType([]);
  };

  return (
    <div
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-6 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none hidden"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
        <h3 className="font-playfair text-lg font-semibold text-foreground">Filters</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
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
                checked={selectedCuts.includes(cut)}
                onCheckedChange={() => toggleOption(cut, selectedCuts, setSelectedCuts)}
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
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleOption(color, selectedColors, setSelectedColors)}
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
                checked={selectedClarity.includes(clarity)}
                onCheckedChange={() => toggleOption(clarity, selectedClarity, setSelectedClarity)}
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
            value={caratRange}
            onValueChange={setCaratRange}
            min={0.1}
            max={20}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{caratRange[0].toFixed(2)} ct</span>
            <span>{caratRange[1].toFixed(2)} ct</span>
          </div>
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
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
                checked={selectedStatus.includes(status)}
                onCheckedChange={() => toggleOption(status, selectedStatus, setSelectedStatus)}
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
                checked={selectedSaleType.includes(type)}
                onCheckedChange={() => toggleOption(type, selectedSaleType, setSelectedSaleType)}
              />
              {type}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear All Button */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilters;
