import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-foreground hover:text-gold transition-colors"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="pt-2 space-y-3">{children}</div>}
    </div>
  );
};

interface CheckboxFilterProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CheckboxFilter = ({ id, label, checked, onCheckedChange }: CheckboxFilterProps) => (
  <div className="flex items-center gap-3">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold"
    />
    <label
      htmlFor={id}
      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
    >
      {label}
    </label>
  </div>
);

const CategoryFilters = () => {
  // Cut filter state
  const [cuts, setCuts] = useState<Record<string, boolean>>({
    round: false,
    princess: false,
    cushion: false,
    oval: false,
    pear: false,
    emerald: false,
    heart: false,
    radiant: false,
  });

  // Color filter state
  const [colors, setColors] = useState<Record<string, boolean>>({
    natural: false,
    coloured: false,
  });

  // Clarity filter state
  const [clarity, setClarity] = useState<Record<string, boolean>>({
    si2: false,
    si1: false,
    vs2: false,
    vs1: false,
    vvs2: false,
    vvs1: false,
    sl: false,
    if: false,
  });

  // Carat range state
  const [caratRange, setCaratRange] = useState([0.10, 20]);

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Status filter state
  const [status, setStatus] = useState<Record<string, boolean>>({
    redeemed: false,
  });

  // Sale type filter state
  const [saleType, setSaleType] = useState<Record<string, boolean>>({
    fixed: false,
    auction: false,
  });

  const handleCutChange = (key: string, checked: boolean) => {
    setCuts((prev) => ({ ...prev, [key]: checked }));
  };

  const handleColorChange = (key: string, checked: boolean) => {
    setColors((prev) => ({ ...prev, [key]: checked }));
  };

  const handleClarityChange = (key: string, checked: boolean) => {
    setClarity((prev) => ({ ...prev, [key]: checked }));
  };

  const handleStatusChange = (key: string, checked: boolean) => {
    setStatus((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSaleTypeChange = (key: string, checked: boolean) => {
    setSaleType((prev) => ({ ...prev, [key]: checked }));
  };

  const clearAllFilters = () => {
    setCuts({ round: false, princess: false, cushion: false, oval: false, pear: false, emerald: false, heart: false, radiant: false });
    setColors({ natural: false, coloured: false });
    setClarity({ si2: false, si1: false, vs2: false, vs1: false, vvs2: false, vvs1: false, sl: false, if: false });
    setCaratRange([0.10, 20]);
    setPriceRange([0, 100000]);
    setStatus({ redeemed: false });
    setSaleType({ fixed: false, auction: false });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-lg font-semibold text-foreground">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-xs text-muted-foreground hover:text-gold"
        >
          Clear All
        </Button>
      </div>

      {/* Cut Filter */}
      <FilterSection title="Cut">
        {Object.entries({
          round: "Round",
          princess: "Princess",
          cushion: "Cushion",
          oval: "Oval",
          pear: "Pear",
          emerald: "Emerald",
          heart: "Heart",
          radiant: "Radiant",
        }).map(([key, label]) => (
          <CheckboxFilter
            key={key}
            id={`cut-${key}`}
            label={label}
            checked={cuts[key]}
            onCheckedChange={(checked) => handleCutChange(key, checked as boolean)}
          />
        ))}
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color">
        {Object.entries({
          natural: "Natural",
          coloured: "Coloured",
        }).map(([key, label]) => (
          <CheckboxFilter
            key={key}
            id={`color-${key}`}
            label={label}
            checked={colors[key]}
            onCheckedChange={(checked) => handleColorChange(key, checked as boolean)}
          />
        ))}
      </FilterSection>

      {/* Clarity Filter */}
      <FilterSection title="Clarity">
        {Object.entries({
          si2: "SI2",
          si1: "SI1",
          vs2: "VS2",
          vs1: "VS1",
          vvs2: "VVS2",
          vvs1: "VVS1",
          sl: "SL",
          if: "IF",
        }).map(([key, label]) => (
          <CheckboxFilter
            key={key}
            id={`clarity-${key}`}
            label={label}
            checked={clarity[key]}
            onCheckedChange={(checked) => handleClarityChange(key, checked as boolean)}
          />
        ))}
      </FilterSection>

      {/* Carat Range Filter */}
      <FilterSection title="Carat">
        <div className="space-y-4">
          <Slider
            value={caratRange}
            onValueChange={setCaratRange}
            min={0.10}
            max={20}
            step={0.10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{caratRange[0].toFixed(2)} ct</span>
            <span>{caratRange[1].toFixed(2)} ct</span>
          </div>
        </div>
      </FilterSection>

      {/* Price Range Filter */}
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
        <CheckboxFilter
          id="status-redeemed"
          label="Redeemed"
          checked={status.redeemed}
          onCheckedChange={(checked) => handleStatusChange("redeemed", checked as boolean)}
        />
      </FilterSection>

      {/* Sale Type Filter */}
      <FilterSection title="Sale Type">
        {Object.entries({
          fixed: "Fixed",
          auction: "Auction",
        }).map(([key, label]) => (
          <CheckboxFilter
            key={key}
            id={`sale-${key}`}
            label={label}
            checked={saleType[key]}
            onCheckedChange={(checked) => handleSaleTypeChange(key, checked as boolean)}
          />
        ))}
      </FilterSection>

      {/* Apply Filters Button */}
      <Button className="w-full mt-6 bg-charcoal hover:bg-charcoal/90 text-cream rounded-full">
        Apply Filters
      </Button>
    </div>
  );
};

export default CategoryFilters;
