export type SaleTypeToggle = "ALL" | "FIXEDPRICE" | "AUCTION" | "REDEEMED";

interface SaleTypeToggleProps {
  activeSaleType: SaleTypeToggle;
  onSaleTypeChange: (type: SaleTypeToggle) => void;
}

const SaleTypeToggleComponent = ({ activeSaleType, onSaleTypeChange }: SaleTypeToggleProps) => {
  const buttons = [
    { type: "ALL" as const, label: "All" },
    { type: "FIXEDPRICE" as const, label: "On Sale" },
    { type: "AUCTION" as const, label: "Auction" },
    { type: "REDEEMED" as const, label: "Redeemed" },
  ];

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 p-0.5 bg-muted/20">
      {buttons.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onSaleTypeChange(type)}
          className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
            activeSaleType === type
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SaleTypeToggleComponent;
