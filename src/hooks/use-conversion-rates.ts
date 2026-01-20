import { useState, useEffect } from "react";
import { getConversionRate } from "@/lib/market-api";

const SUPPORTED_COINS = ["LCX", "USDT", "USDC", "WETH"];

interface UseConversionRatesOptions {
  enabled?: boolean;
  coins?: string[];
}

interface UseConversionRatesResult {
  rates: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  getUsdPrice: (amount: number, coin: string) => number | null;
}

/**
 * Custom hook to fetch and manage currency conversion rates
 * @param options - Configuration options
 * @returns Conversion rates and helper functions
 */
export function useConversionRates(
  options: UseConversionRatesOptions = {}
): UseConversionRatesResult {
  const { enabled = true, coins = SUPPORTED_COINS } = options;
  
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setRates({});
      return;
    }

    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      
      const fetchedRates: Record<string, number> = {};
      
      try {
        for (const coin of coins) {
          const response = await getConversionRate(coin, 1);
          if (response.data?.result?.USD) {
            fetchedRates[coin] = response.data.result.USD;
          }
        }
        setRates(fetchedRates);
      } catch (err) {
        setError("Failed to fetch conversion rates");
        console.error("Error fetching conversion rates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [enabled, coins.join(",")]);

  /**
   * Convert an amount from a specific coin to USD
   */
  const getUsdPrice = (amount: number, coin: string): number | null => {
    const upperCoin = coin?.toUpperCase();
    if (upperCoin === "USD") return amount;
    
    const rate = rates[upperCoin];
    if (!rate) return null;
    
    return amount * rate;
  };

  return { rates, isLoading, error, getUsdPrice };
}

export default useConversionRates;

