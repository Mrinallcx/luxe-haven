import React from "react";
import { cn } from "@/lib/utils";

interface ProductNameProps {
  name: string;
  className?: string;
}

const ProductName: React.FC<ProductNameProps> = ({ name, className }) => {
  // Check if name matches "Toto Silver #XXX" pattern
  const totoSilverMatch = name.match(/^(Toto Silver )(#\d+)$/);
  
  if (totoSilverMatch) {
    return (
      <span className={cn("font-serif", className)}>
        {totoSilverMatch[1]}
        <span className="font-sans">{totoSilverMatch[2]}</span>
      </span>
    );
  }
  
  return <span className={cn("font-serif", className)}>{name}</span>;
};

export default ProductName;
