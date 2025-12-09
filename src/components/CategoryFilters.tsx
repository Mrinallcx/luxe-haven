import { useState } from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleCheckboxChange = (
    category: keyof Pick<FilterState, "cut" | "color" | "clarity" | "status" | "saleType">,
    value: string,
    checked: boolean
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((v) => v !== value),
    }));
  };

  const handleCaratChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      carat: [value[0], value[1]] as [number, number],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      price: [value[0], value[1]] as [number, number],
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-playfair text-xl">Filters</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="px-6 space-y-6">
            {/* Cut Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Cut</h3>
              <div className="grid grid-cols-2 gap-3">
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
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {cut}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Color Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Color</h3>
              <div className="grid grid-cols-2 gap-3">
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
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Clarity Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Clarity</h3>
              <div className="grid grid-cols-2 gap-3">
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
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {clarity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Carat Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Carat</h3>
                <span className="text-sm text-muted-foreground">
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

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Price</h3>
                <span className="text-sm text-muted-foreground">
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

            <Separator />

            {/* Status Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Status</h3>
              <div className="grid grid-cols-2 gap-3">
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
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sale Type Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Sale Type</h3>
              <div className="grid grid-cols-2 gap-3">
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
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {saleType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <Button
            onClick={handleApply}
            className="w-full rounded-full bg-charcoal hover:bg-charcoal/90 text-cream"
          >
            Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryFilters;
