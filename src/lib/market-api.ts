import { apiRequest, API_BASE_URL } from "./api";

// Trending products API types
export interface TrendingProductsPayload {
  saleType: "All" | "FIXEDPRICE" | "AUCTION";
  edition: "All" | "Diamonds" | "Gold" | "Silver" | "Platinum" | "Sapphire";
  endingInDays: "Max" | string;
  sortBy: string;
}

// API response product structure (matching actual backend response)
export interface ApiTrendingProduct {
  _id: string;
  tokenId: number;
  assetId: number;
  name: string;
  price: number;
  usdPrice: number;
  listingPrice: number;
  listingCoin: string;
  coin: string;
  image: string;
  assetUrl: string;
  saleType: "FIXEDPRICE" | "AUCTION" | string;
  edition: string;
  shape?: string;
  cut?: string;
  clarity?: string;
  carat?: number;
  color?: string;
  colorType?: string;
  wishlistCount?: number;
  viewCount?: number;
  mediaType?: string;
  // Add other fields as needed
}

export interface TrendingProductsResponse {
  msg: string;
  result: ApiTrendingProduct[];
}

// Normalized product structure for frontend use
export interface NormalizedProduct {
  id: number;
  _id: string;
  name: string;
  price: number;
  pricePerUnit: string;
  image: string;
  category: string;
  purity: string;
  weight: string;
  status: "sale" | "auction";
}

/**
 * Normalize API product to frontend product format
 */
export function normalizeProduct(apiProduct: ApiTrendingProduct): NormalizedProduct {
  return {
    id: apiProduct.tokenId || apiProduct.assetId,
    _id: apiProduct._id,
    name: apiProduct.name,
    price: apiProduct.listingPrice || apiProduct.price || apiProduct.usdPrice,
    pricePerUnit: apiProduct.listingCoin || apiProduct.coin || "USD",
    image: apiProduct.image || apiProduct.assetUrl,
    category: apiProduct.edition,
    purity: apiProduct.clarity || "",
    weight: apiProduct.carat ? `${apiProduct.carat} ct` : "",
    status: apiProduct.saleType === "AUCTION" ? "auction" : "sale",
  };
}

/**
 * Fetch trending products from the market
 */
export async function getTrendingProducts(payload: TrendingProductsPayload) {
  return apiRequest<TrendingProductsResponse>("/market/trending", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Rate conversion API types
export interface RatePayload {
  fromCoin: string;
  value: number;
}

export interface RateResponse {
  result: {
    TIA: number;
    USD: number;
    USDT: number;
    USDC: number;
    LCX: number;
    WETH: number;
    ETH: number;
    ADA: number;
    TOTO: number;
    PAXG: number;
    XAUT: number;
    [key: string]: number;
  };
}

/**
 * Get currency conversion rates
 */
export async function getConversionRate(fromCoin: string, value: number = 1) {
  return apiRequest<RateResponse>("/rate", {
    method: "POST",
    body: JSON.stringify({ fromCoin, value }),
  });
}

/**
 * Convert price from one currency to USD
 */
export async function convertToUsd(fromCoin: string, amount: number): Promise<number | null> {
  const response = await getConversionRate(fromCoin, amount);
  if (response.error || !response.data?.result) {
    return null;
  }
  return response.data.result.USD;
}

// Auth Markets API types (for category/collection pages)
export interface AuthMarketsPayload {
  page: number;
  search: string;
  sortBy: string;
  edition: string[];
  saleType: "ALL" | "FIXEDPRICE" | "AUCTION";
  cut?: string[];
  clarity?: string[];
  color?: {
    type: string;
    natural: { color: string[] };
    colored: { color: string[]; intensity: string[] };
  };
  minCarat?: number;
  maxCarat?: number;
  priceRangeMin: number;
  priceRangeMax: number;
  status: string[];
  sapphireColor?: string[];
}

export interface AuthMarketsResponse {
  msg: string;
  result: ApiTrendingProduct[];
  totalCount?: number;
  page?: number;
  totalPages?: number;
}

/**
 * Fetch products for category/collection pages with filters
 */
export async function getAuthMarkets(payload: AuthMarketsPayload) {
  return apiRequest<AuthMarketsResponse>("/market/auth-markets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Build default auth-markets payload for a category
 */
export function buildAuthMarketsPayload(
  categorySlug: string,
  page: number = 1,
  filters?: Partial<AuthMarketsPayload>
): AuthMarketsPayload {
  // Map category slug to edition format
  // Diamonds uses "all-diamonds", others use just the category name
  const editionMap: Record<string, string> = {
    diamonds: "all-diamonds",
    gold: "gold",
    silver: "silver",
    platinum: "platinum",
    sapphire: "sapphire",
  };

  const edition = editionMap[categorySlug.toLowerCase()] || categorySlug.toLowerCase();
  const slug = categorySlug.toLowerCase();

  // Base payload
  const basePayload: AuthMarketsPayload = {
    page,
    search: "",
    sortBy: "sortBy",
    edition: [edition],
    saleType: "ALL",
    cut: [],
    clarity: [],
    color: {
      type: "",
      natural: { color: [] },
      colored: { color: [], intensity: [] },
    },
    minCarat: 0.1,
    maxCarat: 20,
    priceRangeMin: 1,
    priceRangeMax: 100000,
    status: [],
  };

  // Category-specific fields
  if (slug === "diamonds") {
    // Diamonds includes all fields, default to FIXEDPRICE to show only items on sale
    return { 
      ...basePayload, 
      saleType: "FIXEDPRICE",
      ...filters 
    };
  } else if (slug === "sapphire") {
    // Sapphire includes cut, minCarat, maxCarat, sapphireColor
    return {
      page,
      search: "",
      sortBy: "sortBy",
      edition: [edition],
      saleType: "ALL",
      cut: [],
      minCarat: 0.1,
      maxCarat: 20,
      priceRangeMin: 1,
      priceRangeMax: 100000,
      status: [],
      sapphireColor: [],
      ...filters,
    } as AuthMarketsPayload;
  } else {
    // Gold, Silver, Platinum - simpler payload
    return {
      page,
      search: "",
      sortBy: "sortBy",
      edition: [edition],
      saleType: "ALL",
      priceRangeMin: 1,
      priceRangeMax: 100000,
      status: [],
      ...filters,
    } as AuthMarketsPayload;
  }
}
