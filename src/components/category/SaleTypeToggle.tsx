import { ChevronDown, Tag, Gavel, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SaleTypeToggle = "ALL" | "FIXEDPRICE" | "AUCTION" | "REDEEMED";

interface SaleTypeToggleProps {
  activeSaleType: SaleTypeToggle;
  onSaleTypeChange: (type: SaleTypeToggle) => void;
}

const getSaleTypeLabel = (type: SaleTypeToggle): string => {
  switch (type) {
    case "ALL":
      return "All";
    case "FIXEDPRICE":
      return "On Sale";
    case "AUCTION":
      return "Auction";
    case "REDEEMED":
      return "Redeemed";
    default:
      return "All";
  }
};

const SaleTypeToggleComponent = ({ activeSaleType, onSaleTypeChange }: SaleTypeToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-transparent hover:bg-foreground/5 text-foreground h-10 px-4 py-2 rounded-lg border-border gap-2 text-sm">
        {getSaleTypeLabel(activeSaleType)}
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border border-border rounded-xl p-2 min-w-[160px] shadow-lg" align="end">
        <DropdownMenuItem
          onClick={() => onSaleTypeChange("ALL")}
          className={`w-full px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 rounded-lg ${
            activeSaleType === "ALL"
              ? "bg-muted/50 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          All
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSaleTypeChange("FIXEDPRICE")}
          className={`w-full px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 rounded-lg flex items-center gap-2 ${
            activeSaleType === "FIXEDPRICE"
              ? "bg-muted/50 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          On Sale
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSaleTypeChange("AUCTION")}
          className={`w-full px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 rounded-lg flex items-center gap-2 ${
            activeSaleType === "AUCTION"
              ? "bg-muted/50 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          Auction
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSaleTypeChange("REDEEMED")}
          className={`w-full px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 rounded-lg flex items-center gap-2 ${
            activeSaleType === "REDEEMED"
              ? "bg-muted/50 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Redeemed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SaleTypeToggleComponent;

