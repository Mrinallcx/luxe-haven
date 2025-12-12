import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}

const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted/20 border border-border rounded-lg p-1">
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 rounded-md ${viewMode === "grid" ? "bg-gold text-charcoal hover:bg-gold" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 rounded-md ${viewMode === "list" ? "bg-gold text-charcoal hover:bg-gold" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onViewChange("list")}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
