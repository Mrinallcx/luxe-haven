import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FilterSection {
  title: string;
  isOpen: boolean;
}

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

const cutOptions = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Radiant"];
const colorOptions = ["Natural", "Coloured"];
const clarityOptions = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "SL", "IF"];
const statusOptions = ["Redeemed"];
const saleTypeOptions = ["Fixed", "Auction"];

const CategoryFilters = ({ filters, onFiltersChange }: CategoryFiltersProps) => {
  const [sections, setSections] = useState<Record<string, boolean>>({
    cut: true,
    color: true,
    clarity: true,
    carat: true,
    price: true,
    status: true,
    saleType: true,
  });

  const toggleSection = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    filterKey: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFiltersChange({ ...filters, [filterKey]: newValues });
  };

  const handleRangeChange = (
    filterKey: "carat" | "price",
    values: number[]
  ) => {
    onFiltersChange({ ...filters, [filterKey]: [values[0], values[1]] as [number, number] });
  };

  const FilterHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 text-sm font-medium text-foreground"
    >
      {title}
      <ChevronDown
        className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          sections[section] && "rotate-180"
        )}
      />
    </button>
  );

  const CheckboxGroup = ({
    options,
    filterKey,
  }: {
    options: string[];
    filterKey: keyof FilterState;
  }) => (
    <div className="space-y-2.5 pb-4">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Checkbox
            checked={(filters[filterKey] as string[]).includes(option)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(filterKey, option, checked as boolean)
            }
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-5">
        <h3 className="font-playfair text-lg text-foreground mb-4">Filters</h3>

        {/* Cut */}
        <div className="border-b border-border/50">
          <FilterHeader title="Cut" section="cut" />
          {sections.cut && <CheckboxGroup options={cutOptions} filterKey="cut" />}
        </div>

        {/* Color */}
        <div className="border-b border-border/50">
          <FilterHeader title="Color" section="color" />
          {sections.color && <CheckboxGroup options={colorOptions} filterKey="color" />}
        </div>

        {/* Clarity */}
        <div className="border-b border-border/50">
          <FilterHeader title="Clarity" section="clarity" />
          {sections.clarity && <CheckboxGroup options={clarityOptions} filterKey="clarity" />}
        </div>

        {/* Carat Range */}
        <div className="border-b border-border/50">
          <FilterHeader title="Carat" section="carat" />
          {sections.carat && (
            <div className="pb-4 space-y-4">
              <Slider
                value={filters.carat}
                onValueChange={(values) => handleRangeChange("carat", values)}
                min={0.1}
                max={20}
                step={0.1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.carat[0].toFixed(1)} ct</span>
                <span>{filters.carat[1].toFixed(1)} ct</span>
              </div>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-border/50">
          <FilterHeader title="Price" section="price" />
          {sections.price && (
            <div className="pb-4 space-y-4">
              <Slider
                value={filters.price}
                onValueChange={(values) => handleRangeChange("price", values)}
                min={0}
                max={100000}
                step={100}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>${filters.price[0].toLocaleString()}</span>
                <span>${filters.price[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="border-b border-border/50">
          <FilterHeader title="Status" section="status" />
          {sections.status && <CheckboxGroup options={statusOptions} filterKey="status" />}
        </div>

        {/* Sale Type */}
        <div>
          <FilterHeader title="Sale Type" section="saleType" />
          {sections.saleType && <CheckboxGroup options={saleTypeOptions} filterKey="saleType" />}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
