import { useState, useEffect, useCallback } from "react";
import { getTrendingProducts, normalizeProduct, TrendingProductsPayload } from "@/lib/market-api";
import { ProductCardData } from "@/components/shared/ProductCard";

// Category to image mapping
import diamondProduct from "@/assets/diamond-product.webp";
import goldProduct from "@/assets/gold-product.webp";
import silverProduct from "@/assets/silver-product.webp";
import sapphireProduct from "@/assets/sapphire-product.webp";
import platinumProduct from "@/assets/platinum-product.webp";

const CATEGORY_IMAGES: Record<string, string> = {
  Diamonds: diamondProduct,
  Gold: goldProduct,
  Silver: silverProduct,
  Platinum: platinumProduct,
  Sapphire: sapphireProduct,
};

const getCategoryImage = (category: string): string => {
  return CATEGORY_IMAGES[category] || diamondProduct;
};

interface UseTrendingProductsOptions {
  category: string;
  saleType?: "All" | "FIXEDPRICE" | "AUCTION";
  limit?: number;
  fallbackToAll?: boolean;
}

interface UseTrendingProductsResult {
  products: (ProductCardData & { isSoldOut?: boolean })[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch trending products from the API
 */
export function useTrendingProducts(
  options: UseTrendingProductsOptions
): UseTrendingProductsResult {
  const { 
    category, 
    saleType = "FIXEDPRICE", 
    limit = 4,
    fallbackToAll = true 
  } = options;

  const [products, setProducts] = useState<(ProductCardData & { isSoldOut?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const payload: TrendingProductsPayload = {
      saleType,
      edition: category as TrendingProductsPayload["edition"],
      endingInDays: "Max",
      sortBy: "sortBy",
    };

    let response = await getTrendingProducts(payload);
    let showingSoldItems = false;

    // Fallback: if no results, try "All" and mark as sold out
    if (fallbackToAll && (!response.data?.result || response.data.result.length === 0) && saleType !== "All") {
      const fallbackPayload = { ...payload, saleType: "All" as const };
      response = await getTrendingProducts(fallbackPayload);
      showingSoldItems = true;
    }

    setIsLoading(false);

    if (response.error) {
      console.error("Failed to fetch trending products:", response.error);
      setError(response.error);
      setProducts([]);
      return;
    }

    if (response.data?.result && response.data.result.length > 0) {
      const apiProducts = response.data.result.slice(0, limit).map((p) => {
        const normalized = normalizeProduct(p);
        return {
          ...normalized,
          image: normalized.image || getCategoryImage(normalized.category),
          isSoldOut: showingSoldItems,
        };
      });
      setProducts(apiProducts);
    } else {
      setProducts([]);
    }
  }, [category, saleType, limit, fallbackToAll]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}

export default useTrendingProducts;

