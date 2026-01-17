import { Tag, Gavel, Package } from "lucide-react";

export type SaleTypeToggle = "ALL" | "FIXEDPRICE" | "AUCTION" | "REDEEMED";

interface SaleTypeToggleProps {
  activeSaleType: SaleTypeToggle;
  onSaleTypeChange: (type: SaleTypeToggle) => void;
}

const SaleTypeToggleComponent = ({ activeSaleType, onSaleTypeChange }: SaleTypeToggleProps) => {
  return (
    <div className="flex items-center bg-secondary rounded-full p-1">
      <button
        onClick={() => onSaleTypeChange("ALL")}
        className={`w-[70px] py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center gap-1.5 ${
          activeSaleType === "ALL"
            ? "bg-charcoal text-cream shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onSaleTypeChange("FIXEDPRICE")}
        className={`w-[90px] py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center gap-1.5 ${
          activeSaleType === "FIXEDPRICE"
            ? "bg-charcoal text-cream shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
        On Sale
      </button>
      <button
        onClick={() => onSaleTypeChange("AUCTION")}
        className={`w-[90px] py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center gap-1.5 ${
          activeSaleType === "AUCTION"
            ? "bg-gold text-charcoal shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Gavel className="w-3.5 h-3.5" />
        Auction
      </button>
      <button
        onClick={() => onSaleTypeChange("REDEEMED")}
        className={`w-[100px] py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center gap-1.5 ${
          activeSaleType === "REDEEMED"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Package className="w-3.5 h-3.5" />
        Redeemed
      </button>
    </div>
  );
};

export default SaleTypeToggleComponent;

