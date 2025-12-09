import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CategoryFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  cuts: string[];
  colors: string[];
  clarities: string[];
  caratRange: [number, number];
  priceRange: [number, number];
  status: string[];
  saleTypes: string[];
}

const CUTS = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
const COLORS = ["Natural", "Coloured"];
const CLARITIES = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
const STATUSES = ["Redeemed"];
const SALE_TYPES = ["Fixed", "Auction"];

const CategoryFilters = ({ onFiltersChange }: CategoryFiltersProps) => {
  const [cuts, setCuts] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [clarities, setClarities] = useState<string[]>([]);
  const [caratRange, setCaratRange] = useState<[number, number]>([0.1, 20]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [status, setStatus] = useState<string[]>([]);
  const [saleTypes, setSaleTypes] = useState<string[]>([]);

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="space-y-6">

      {/* Cut */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Cut</h4>
        <div className="grid grid-cols-2 gap-2">
          {CUTS.map((cut) => (
            <div key={cut} className="flex items-center gap-2">
              <Checkbox
                id={`cut-${cut}`}
                checked={cuts.includes(cut)}
                onCheckedChange={() => toggleArrayItem(cuts, cut, setCuts)}
              />
              <Label htmlFor={`cut-${cut}`} className="text-sm text-muted-foreground cursor-pointer">
                {cut}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Color</h4>
        <div className="flex flex-col gap-2">
          {COLORS.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <Checkbox
                id={`color-${color}`}
                checked={colors.includes(color)}
                onCheckedChange={() => toggleArrayItem(colors, color, setColors)}
              />
              <Label htmlFor={`color-${color}`} className="text-sm text-muted-foreground cursor-pointer">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clarity */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Clarity</h4>
        <div className="grid grid-cols-2 gap-2">
          {CLARITIES.map((clarity) => (
            <div key={clarity} className="flex items-center gap-2">
              <Checkbox
                id={`clarity-${clarity}`}
                checked={clarities.includes(clarity)}
                onCheckedChange={() => toggleArrayItem(clarities, clarity, setClarities)}
              />
              <Label htmlFor={`clarity-${clarity}`} className="text-sm text-muted-foreground cursor-pointer">
                {clarity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Carat Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Carat</h4>
        <Slider
          min={0.1}
          max={20}
          step={0.1}
          value={caratRange}
          onValueChange={(value) => setCaratRange(value as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{caratRange[0].toFixed(1)} ct</span>
          <span>{caratRange[1].toFixed(1)} ct</span>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Price</h4>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Status</h4>
        <div className="flex flex-col gap-2">
          {STATUSES.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox
                id={`status-${s}`}
                checked={status.includes(s)}
                onCheckedChange={() => toggleArrayItem(status, s, setStatus)}
              />
              <Label htmlFor={`status-${s}`} className="text-sm text-muted-foreground cursor-pointer">
                {s}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sale Type */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Sale Type</h4>
        <div className="flex flex-col gap-2">
          {SALE_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`sale-${type}`}
                checked={saleTypes.includes(type)}
                onCheckedChange={() => toggleArrayItem(saleTypes, type, setSaleTypes)}
              />
              <Label htmlFor={`sale-${type}`} className="text-sm text-muted-foreground cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
