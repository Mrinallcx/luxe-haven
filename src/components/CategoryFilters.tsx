import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface FilterState {
  cut: string[];
  color: string[];
  clarity: string[];
  carat: [number, number];
  price: [number, number];
  status: string[];
  saleType: string[];
}

interface CategoryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const CUT_OPTIONS = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
const COLOR_OPTIONS = ["Natural", "Coloured"];
const CLARITY_OPTIONS = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
const STATUS_OPTIONS = ["Redeemed"];
const SALE_TYPE_OPTIONS = ["Fixed", "Auction"];

const CARAT_MIN = 0.10;
const CARAT_MAX = 20;
const PRICE_MIN = 0;
const PRICE_MAX = 100000;

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const FilterSection = ({ title, defaultOpen = true, children }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left">
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const CategoryFilters = ({ filters, onFiltersChange }: CategoryFiltersProps) => {
  const handleCheckboxChange = (
    category: keyof Pick<FilterState, "cut" | "color" | "clarity" | "status" | "saleType">,
    value: string,
    checked: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [category]: checked
        ? [...filters[category], value]
        : filters[category].filter((v) => v !== value),
    });
  };

  const handleCaratChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      carat: [value[0], value[1]] as [number, number],
    });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      price: [value[0], value[1]] as [number, number],
    });
  };

  const handleReset = () => {
    onFiltersChange({
      cut: [],
      color: [],
      clarity: [],
      carat: [CARAT_MIN, CARAT_MAX],
      price: [PRICE_MIN, PRICE_MAX],
      status: [],
      saleType: [],
    });
  };

  const activeFiltersCount =
    filters.cut.length +
    filters.color.length +
    filters.clarity.length +
    filters.status.length +
    filters.saleType.length +
    (filters.carat[0] !== CARAT_MIN || filters.carat[1] !== CARAT_MAX ? 1 : 0) +
    (filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX ? 1 : 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-lg text-foreground">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Cut Filter */}
      <FilterSection title="Cut">
        <div className="grid grid-cols-2 gap-2">
          {CUT_OPTIONS.map((cut) => (
            <div key={cut} className="flex items-center space-x-2">
              <Checkbox
                id={`cut-${cut}`}
                checked={filters.cut.includes(cut)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("cut", cut, checked as boolean)
                }
              />
              <Label
                htmlFor={`cut-${cut}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                {cut}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="space-y-2">
          {COLOR_OPTIONS.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.color.includes(color)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("color", color, checked as boolean)
                }
              />
              <Label
                htmlFor={`color-${color}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                {color}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Clarity Filter */}
      <FilterSection title="Clarity">
        <div className="grid grid-cols-2 gap-2">
          {CLARITY_OPTIONS.map((clarity) => (
            <div key={clarity} className="flex items-center space-x-2">
              <Checkbox
                id={`clarity-${clarity}`}
                checked={filters.clarity.includes(clarity)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("clarity", clarity, checked as boolean)
                }
              />
              <Label
                htmlFor={`clarity-${clarity}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                {clarity}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Carat Range Filter */}
      <FilterSection title="Carat">
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground text-right">
            {filters.carat[0].toFixed(2)} ct - {filters.carat[1].toFixed(2)} ct
          </div>
          <Slider
            value={filters.carat}
            onValueChange={handleCaratChange}
            min={CARAT_MIN}
            max={CARAT_MAX}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{CARAT_MIN} ct</span>
            <span>{CARAT_MAX} ct</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Price Range Filter */}
      <FilterSection title="Price">
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground text-right">
            ${filters.price[0].toLocaleString()} - ${filters.price[1].toLocaleString()}
          </div>
          <Slider
            value={filters.price}
            onValueChange={handlePriceChange}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${PRICE_MIN.toLocaleString()}</span>
            <span>${PRICE_MAX.toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Status Filter */}
      <FilterSection title="Status">
        <div className="space-y-2">
          {STATUS_OPTIONS.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.status.includes(status)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("status", status, checked as boolean)
                }
              />
              <Label
                htmlFor={`status-${status}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                {status}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Sale Type Filter */}
      <FilterSection title="Sale Type">
        <div className="space-y-2">
          {SALE_TYPE_OPTIONS.map((saleType) => (
            <div key={saleType} className="flex items-center space-x-2">
              <Checkbox
                id={`saleType-${saleType}`}
                checked={filters.saleType.includes(saleType)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("saleType", saleType, checked as boolean)
                }
              />
              <Label
                htmlFor={`saleType-${saleType}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                {saleType}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default CategoryFilters;
