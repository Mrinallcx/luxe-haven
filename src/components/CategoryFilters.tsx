import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const CategoryFilters = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: CategoryFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cut: true,
    color: true,
    clarity: true,
    carat: true,
    price: true,
    status: true,
    saleType: true,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (
    category: keyof Pick<FilterState, "cut" | "color" | "clarity" | "status" | "saleType">,
    value: string,
    checked: boolean
  ) => {
    const newFilters = {
      ...localFilters,
      [category]: checked
        ? [...localFilters[category], value]
        : localFilters[category].filter((v) => v !== value),
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCaratChange = (value: number[]) => {
    const newFilters = {
      ...localFilters,
      carat: [value[0], value[1]] as [number, number],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = {
      ...localFilters,
      price: [value[0], value[1]] as [number, number],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      cut: [],
      color: [],
      clarity: [],
      carat: [CARAT_MIN, CARAT_MAX],
      price: [PRICE_MIN, PRICE_MAX],
      status: [],
      saleType: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount = 
    localFilters.cut.length +
    localFilters.color.length +
    localFilters.clarity.length +
    localFilters.status.length +
    localFilters.saleType.length +
    (localFilters.carat[0] !== CARAT_MIN || localFilters.carat[1] !== CARAT_MAX ? 1 : 0) +
    (localFilters.price[0] !== PRICE_MIN || localFilters.price[1] !== PRICE_MAX ? 1 : 0);

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode;
  }) => (
    <Collapsible open={expandedSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:text-gold transition-colors">
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 overflow-hidden"
        >
          <div className="w-[280px] bg-card border border-border/50 rounded-xl p-5 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-lg text-foreground">Filters</h2>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="mb-2" />

            {/* Cut Filter */}
            <FilterSection title="Cut" sectionKey="cut">
              <div className="grid grid-cols-2 gap-2">
                {CUT_OPTIONS.map((cut) => (
                  <div key={cut} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cut-${cut}`}
                      checked={localFilters.cut.includes(cut)}
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
            <FilterSection title="Color" sectionKey="color">
              <div className="grid grid-cols-2 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={localFilters.color.includes(color)}
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
            <FilterSection title="Clarity" sectionKey="clarity">
              <div className="grid grid-cols-2 gap-2">
                {CLARITY_OPTIONS.map((clarity) => (
                  <div key={clarity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`clarity-${clarity}`}
                      checked={localFilters.clarity.includes(clarity)}
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
            <FilterSection title="Carat" sectionKey="carat">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {localFilters.carat[0].toFixed(2)} ct - {localFilters.carat[1].toFixed(2)} ct
                  </span>
                </div>
                <Slider
                  value={localFilters.carat}
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
            <FilterSection title="Price" sectionKey="price">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    ${localFilters.price[0].toLocaleString()} - ${localFilters.price[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={localFilters.price}
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
            <FilterSection title="Status" sectionKey="status">
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={localFilters.status.includes(status)}
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
            <FilterSection title="Sale Type" sectionKey="saleType">
              <div className="grid grid-cols-2 gap-2">
                {SALE_TYPE_OPTIONS.map((saleType) => (
                  <div key={saleType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`saleType-${saleType}`}
                      checked={localFilters.saleType.includes(saleType)}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryFilters;