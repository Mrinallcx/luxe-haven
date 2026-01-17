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
  firstSoldAt?: string; // If present, the asset has been sold
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
 * Map edition to category slug for navigation
 * Diamond editions (Genesis, Argyle, etc.) should all map to "diamonds"
 */
function editionToCategory(edition: string): string {
  const editionLower = edition?.toLowerCase() || "";
  
  // Diamond editions
  if (
    editionLower === "genesis" ||
    editionLower === "argyle" ||
    editionLower === "all-diamonds" ||
    editionLower.includes("diamond")
  ) {
    return "diamonds";
  }
  
  // Direct mappings
  if (editionLower === "gold") return "gold";
  if (editionLower === "silver") return "silver";
  if (editionLower === "platinum") return "platinum";
  if (editionLower === "sapphire") return "sapphire";
  
  // Default: use the edition as category (lowercase)
  return editionLower;
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
    category: editionToCategory(apiProduct.edition),
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

// Market Details API types (for single product/asset details)
export interface MarketDetailsPayload {
  tokenId: string;
}

export interface MarketDetailsResponse {
  msg: string;
  result: {
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
    saleType: string;
    edition: string;
    owner: string;
    chain: string;
    wishlistCount: number;
    viewCount: number;
    offers: Array<{
      id: string;
      price: number;
      token: string;
      expiresAt: number;
    }>;
    highestBid: {
      price: number;
      token: string;
    } | null;
    bestOffer: {
      price: number;
      token: string;
    } | null;
    // Diamond specific fields
    shape?: string;
    cut?: string;
    clarity?: string;
    carat?: number;
    color?: string;
    colorType?: string;
    // Platinum/Gold specific fields
    platinumWeight?: number;
    platinumFineness?: number;
    goldWeight?: number;
    goldFineness?: number;
    silverWeight?: number;
    silverFineness?: number;
    mediaType?: string;
    createdAt?: string;
    updatedAt?: string;
    firstSoldAt?: string;
    saleStartAt?: number;
    saleEndAt?: number;
    saleValidTill?: number;
  };
}

/**
 * Fetch single product/asset details by tokenId
 */
export async function getMarketDetails(tokenId: string | number) {
  return apiRequest<MarketDetailsResponse>("/tiamond/market-details", {
    method: "POST",
    body: JSON.stringify({ tokenId: String(tokenId) }),
  });
}

/**
 * Normalize market details response to product format
 */
export function normalizeMarketDetails(details: MarketDetailsResponse["result"]): NormalizedProduct & {
  owner: string;
  chain: string;
  wishlistCount: number;
  viewCount: number;
  offers: Array<{ id: string; price: number; token: string; expiresAt: number }>;
  highestBid: { price: number; token: string } | null;
  bestOffer: { price: number; token: string } | null;
  saleType: string;
  saleStartAt?: number;
  saleEndAt?: number;
} {
  return {
    id: details.tokenId || details.assetId,
    _id: details._id,
    name: details.name,
    price: details.listingPrice || details.price || details.usdPrice,
    pricePerUnit: details.listingCoin || details.coin || "USD",
    image: details.image || details.assetUrl,
    category: editionToCategory(details.edition || ""),
    purity: details.clarity || (details.platinumFineness ? `${details.platinumFineness}` : "") || (details.goldFineness ? `${details.goldFineness}` : ""),
    weight: details.carat ? `${details.carat} ct` : (details.platinumWeight ? `${details.platinumWeight}g` : "") || (details.goldWeight ? `${details.goldWeight}g` : ""),
    status: details.saleType === "AUCTION" ? "auction" : "sale",
    owner: details.owner,
    chain: details.chain,
    wishlistCount: details.wishlistCount,
    viewCount: details.viewCount,
    offers: details.offers || [],
    highestBid: details.highestBid,
    bestOffer: details.bestOffer,
    saleType: details.saleType,
    saleStartAt: details.saleStartAt,
    saleEndAt: details.saleEndAt,
  };
}

// Tiamond Details API types (for product overview)
export interface TiamondDetailsPayload {
  tokenId: string;
}

export interface TiamondDetails {
  tiamond: {
    tokenId: number;
    assetId: number;
    name: string;
    description: string;
    image: string;
    allImages?: string[];
    allVideos?: string[];
    assetUrl?: string[];
    mediaType: string;
    giaCertificate?: string;
    lcxCertificate?: string;
    lppmCertificate?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  market: {
    _id: string;
    tokenId: number;
    name: string;
    edition: string;
    shape?: string;
    cut?: string;
    color?: string;
    clarity?: string;
    carat?: number;
    colorType?: string;
    saleType: string;
    price: number;
    listingPrice: number;
    listingCoin: string;
    usdPrice: number;
    coin: string;
    owner: string;
    chain: string;
    wishlistCount: number;
    viewCount: number;
    image: string;
    assetUrl: string;
    mintStatus: string;
    // Platinum/Gold specific
    platinumWeight?: number;
    platinumFineness?: number;
    goldWeight?: number;
    goldFineness?: number;
    silverWeight?: number;
    silverFineness?: number;
  };
}

export interface TiamondDetailsResponse {
  msg: string;
  result: TiamondDetails;
}

/**
 * Fetch tiamond/product details including description
 */
export async function getTiamondDetails(tokenId: string | number) {
  return apiRequest<TiamondDetailsResponse>("/tiamond", {
    method: "POST",
    body: JSON.stringify({ tokenId: String(tokenId) }),
  });
}

// Activity/Transaction History API types
export interface ActivityPayload {
  tokenId: number;
  assetId: number;
}

export interface ActivityItem {
  hash: string;
  type: string; // "Transfer", "Minted", "Sale", etc.
  from: string;
  to: string;
  tokenId: number;
  status: string;
  timestamp: number;
  chain: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
  coin?: string;
}

export interface ActivityResponse {
  msg: string;
  result: ActivityItem[];
}

/**
 * Fetch transaction activity/history for a product
 */
export async function getProductActivity(tokenId: number, assetId?: number) {
  return apiRequest<ActivityResponse>("/tiamond/activity", {
    method: "POST",
    body: JSON.stringify({ 
      tokenId, 
      assetId: assetId || tokenId 
    }),
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
    // Note: ...filters MUST be last to override defaults like saleType
    const diamondsPayload = { ...basePayload, saleType: "FIXEDPRICE" as const };
    return { ...diamondsPayload, ...filters };
  } else if (slug === "sapphire") {
    // Sapphire includes cut, minCarat, maxCarat, sapphireColor
    // Note: ...filters MUST be last to override defaults like saleType
    const sapphirePayload: AuthMarketsPayload = {
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
    };
    return { ...sapphirePayload, ...filters } as AuthMarketsPayload;
  } else {
    // Gold, Silver, Platinum - simpler payload
    // Note: ...filters MUST be last to override defaults like saleType
    const defaultPayload: AuthMarketsPayload = {
      page,
      search: "",
      sortBy: "sortBy",
      edition: [edition],
      saleType: "ALL",
      priceRangeMin: 1,
      priceRangeMax: 100000,
      status: [],
    };
    return { ...defaultPayload, ...filters } as AuthMarketsPayload;
  }
}
