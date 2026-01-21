import { apiRequest, apiRequestPublic, API_BASE_URL } from "./api";
import { normalizeImageUrl } from "@/utils/product-helpers";

// Search marketplace types
export interface SearchEdition {
  name: string;
  smallName: string;
  fullName: string;
  uri: string;
  imageLink: string;
  smallImageLink: string;
  editionCategory: string;
  externalUrl?: string;
  assetUrl: string;
}

export interface SearchTiamond {
  tokenId: number;
  assetId: number;
  name: string;
  edition: string;
  mintStatus: string;
  price: number;
  coin: string;
  usdPrice: number;
  image: string;
  video?: string;
  mediaType: string;
  smallImageLink?: string;
  assetUrl: string;
  assetType: string;
}

export interface SearchMarketplaceResponse {
  msg: string;
  result: {
    editionsList: SearchEdition[];
    tiamondsList: SearchTiamond[];
  };
}

/**
 * Search the marketplace for tiamonds and editions
 * @param search - Search query (minimum 2 characters)
 */
export async function searchMarketplace(
  search: string
): Promise<{ data?: SearchMarketplaceResponse; error?: string }> {
  // Validate minimum length
  if (!search || search.trim().length < 2) {
    return {
      data: {
        msg: "Search too short",
        result: { editionsList: [], tiamondsList: [] },
      },
    };
  }

  return apiRequest<SearchMarketplaceResponse>("/market/search-marketplace", {
    method: "POST",
    body: JSON.stringify({ search: search.trim() }),
  });
}

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
  assetId: number;
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
    assetId: apiProduct.assetId,
    _id: apiProduct._id,
    name: apiProduct.name,
    price: apiProduct.listingPrice || apiProduct.price || apiProduct.usdPrice,
    pricePerUnit: apiProduct.listingCoin || apiProduct.coin || "USD",
    image: normalizeImageUrl(apiProduct.image || apiProduct.assetUrl),
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

/**
 * Calculate the price in a specific coin for purchase
 * 
 * Priority order:
 * 1. Custom price from listingCoinRequests[selectedCoin].listingPrice (if exists)
 * 2. Direct listingPrice (if selectedCoin === listingCoin)
 * 3. Automatic conversion using rate API
 */
export interface CalculatePriceParams {
  listingCoin: string;
  listingPrice: number;
  selectedCoin: string;
  listingCoinRequests?: Record<string, { listingPrice: number }>;
  conversionRates?: Record<string, number>; // rates from getConversionRate API
}

export function calculatePriceForCoin(params: CalculatePriceParams): {
  amount: number;
  isCustomPrice: boolean;
  requiresConversion: boolean;
} {
  const { listingCoin, listingPrice, selectedCoin, listingCoinRequests, conversionRates } = params;
  
  // 1. Check for custom price in listingCoinRequests
  if (listingCoinRequests && listingCoinRequests[selectedCoin]?.listingPrice !== undefined) {
    return {
      amount: listingCoinRequests[selectedCoin].listingPrice,
      isCustomPrice: true,
      requiresConversion: false,
    };
  }
  
  // 2. If selected coin is the same as listing coin, use listing price directly
  if (selectedCoin.toUpperCase() === listingCoin.toUpperCase()) {
    return {
      amount: listingPrice,
      isCustomPrice: false,
      requiresConversion: false,
    };
  }
  
  // 3. Convert using rate API
  // The rate API returns: how much of each coin equals `value` of `fromCoin`
  // e.g., getConversionRate("USD", 1000) returns { LCX: 20000, ETH: 0.4, ... }
  if (conversionRates && conversionRates[selectedCoin] !== undefined) {
    return {
      amount: conversionRates[selectedCoin],
      isCustomPrice: false,
      requiresConversion: true,
    };
  }
  
  // Fallback: return listing price (should not happen if rates are fetched)
  return {
    amount: listingPrice,
    isCustomPrice: false,
    requiresConversion: false,
  };
}

/**
 * Get all conversion rates for a listing price
 * Returns an object with prices in each supported coin
 */
export async function getAllCoinPrices(
  listingCoin: string,
  listingPrice: number
): Promise<{ rates: Record<string, number>; error?: string }> {
  const response = await getConversionRate(listingCoin, listingPrice);
  
  if (response.error || !response.data?.result) {
    return { rates: {}, error: response.error || "Failed to fetch conversion rates" };
  }
  
  return { rates: response.data.result };
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
    // Multi-coin purchase fields
    allowedListingCoins?: string[];
    listingCoinRequests?: Record<string, { listingPrice: number }>;
    listingDiscount?: number;
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
  isSoldOut: boolean;
  // Multi-coin purchase fields
  allowedListingCoins: string[];
  listingCoinRequests: Record<string, { listingPrice: number }>;
  listingDiscount: number;
  listingCoin: string;
  listingPrice: number;
} {
  // Mark as sold out if saleType is NOSALE OR if firstSoldAt is present
  const isSoldOut = details.saleType === "NOSALE" || !!details.firstSoldAt;
  
  return {
    id: details.tokenId || details.assetId,
    assetId: details.assetId,
    _id: details._id,
    name: details.name,
    price: details.listingPrice || details.price || details.usdPrice,
    pricePerUnit: details.listingCoin || details.coin || "USD",
    image: normalizeImageUrl(details.image || details.assetUrl),
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
    isSoldOut,
    // Multi-coin purchase fields
    allowedListingCoins: details.allowedListingCoins || [details.listingCoin || "USD"],
    listingCoinRequests: details.listingCoinRequests || {},
    listingDiscount: details.listingDiscount || 0,
    listingCoin: details.listingCoin || "USD",
    listingPrice: details.listingPrice || details.price || details.usdPrice,
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

// ============================================================
// Buy Unminted Fixed Price API
// ============================================================

export interface BuyUserOrder {
  assetId: number;
  primaryAmount: number;
  primaryCoin: string;
  secondaryAmount: number;
  secondaryCoin: string;
  buyer: string;
}

export interface BuyUnmintedPayload {
  userOrder: BuyUserOrder;
}

export interface BuyUnmintedTxData {
  from: string;
  to: string;
  data: string;
  gas?: number;
  value?: number | string;
}

export interface BuyUnmintedResponse {
  txData: BuyUnmintedTxData;
  validity: number;
  chain: "ETHEREUM" | "CARDANO";
}

/**
 * Request transaction data for buying an unminted asset at fixed price
 */
export async function buyUnmintedFixedPrice(
  payload: BuyUnmintedPayload
): Promise<{ data?: BuyUnmintedResponse; error?: string }> {
  return apiRequest<BuyUnmintedResponse>("/tiamond/buy-unminted-fixed-price", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==================== USER DASHBOARD APIs ====================

export interface UserOwnedAsset {
  _id: string;
  tokenId: number;
  assetId: number;
  name: string;
  edition: string;
  mintStatus: string;
  saleType: string;
  price: number;
  usdPrice: number;
  coin: string;
  listingPrice?: number;
  listingCoin?: string;
  image: string;
  assetUrl?: string;
  mediaType: string;
  chain: string;
  owner?: string;
  wishlist?: boolean;
  carat?: number;
  clarity?: string;
  cut?: string;
  color?: string;
  goldWeight?: number;
  goldFineness?: number;
  silverWeight?: number;
  silverFineness?: number;
  platinumWeight?: number;
  platinumFineness?: number;
  sapphireWeight?: number;
  firstSoldAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserOwnedAssetsResponse {
  msg: string;
  result: UserOwnedAsset[];
}

/**
 * Fetch user's owned NFTs/assets by wallet address (minted + unminted)
 * @param address - User's wallet address
 */
export async function getUserOwnedAssets(
  address: string
): Promise<{ data?: UserOwnedAssetsResponse; error?: string }> {
  if (!address) {
    return { error: "Wallet address is required" };
  }
  
  return apiRequest<UserOwnedAssetsResponse>(`/user/users-owned-nft?address=${address}`, {
    method: "GET",
  });
}

/**
 * Fetch user's active bids by wallet address
 * @param address - User's wallet address
 */
export async function getUserActiveBids(
  address: string
): Promise<{ data?: UserOwnedAssetsResponse; error?: string }> {
  if (!address) {
    return { error: "Wallet address is required" };
  }
  
  return apiRequest<UserOwnedAssetsResponse>(`/user/users-nft-bid?address=${address}`, {
    method: "GET",
  });
}

// User Orders types
export interface UserOrderParams {
  tokenId?: number;
  assetId?: number;
  defaultAmount?: number;
  primaryAmount?: number;
  primaryCoin?: string;
  secondaryAmount?: number;
  secondaryCoin?: string;
}

export interface UserOrder {
  _id: string;
  userId: string;
  orderType: number; // 1=Fixed Price, 2=Auction, 3=Offer, etc.
  orderStatus: string;
  displayStatus: string;
  orderParams: UserOrderParams;
  validTime: number;
  approvedValidity?: number;
  usdValue?: number;
  createdAt: string;
  updatedAt?: string;
  // Asset info (populated from market)
  tokenId?: number;
  assetId?: number;
  name?: string;
  image?: string;
  edition?: string;
}

export interface UserOrdersResponse {
  message: string;
  result: UserOrder[];
  totalCount: number;
}

export interface UserOrdersPayload {
  address: string;
  orderTypes?: string[]; // ["Listings", "Offers", "Counter offers"]
  redeemableOnly?: boolean;
  page?: number;
}

/**
 * Fetch user's submitted orders
 * @param payload - Order query parameters
 */
export async function getUserOrders(
  payload: UserOrdersPayload
): Promise<{ data?: UserOrdersResponse; error?: string }> {
  if (!payload.address) {
    return { error: "Wallet address is required" };
  }
  
  return apiRequest<UserOrdersResponse>("/user/users-orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Normalize user owned asset to Product format
 */
export function normalizeUserAsset(asset: UserOwnedAsset): NormalizedProduct & {
  owner?: string;
  chain: string;
  mintStatus: string;
  saleType: string;
} {
  return {
    id: asset.tokenId || asset.assetId,
    assetId: asset.assetId,
    _id: asset._id,
    name: asset.name,
    price: asset.listingPrice || asset.price || asset.usdPrice,
    pricePerUnit: asset.listingCoin || asset.coin || "USD",
    image: normalizeImageUrl(asset.image || asset.assetUrl || ""),
    category: editionToCategory(asset.edition || ""),
    purity: asset.clarity || 
      (asset.platinumFineness ? `${asset.platinumFineness}` : "") || 
      (asset.goldFineness ? `${asset.goldFineness}` : "") ||
      (asset.silverFineness ? `${asset.silverFineness}` : ""),
    weight: asset.carat ? `${asset.carat} ct` : 
      (asset.platinumWeight ? `${asset.platinumWeight}g` : "") || 
      (asset.goldWeight ? `${asset.goldWeight}g` : "") ||
      (asset.silverWeight ? `${asset.silverWeight}g` : "") ||
      (asset.sapphireWeight ? `${asset.sapphireWeight} ct` : ""),
    status: asset.saleType === "AUCTION" ? "auction" : "sale",
    owner: asset.owner,
    chain: asset.chain,
    mintStatus: asset.mintStatus,
    saleType: asset.saleType,
  };
}

// ==================== REFERRAL REWARDS API ====================

export interface ReferralRewards {
  accruedRewards: Record<string, number>;
  claimedRewards: Record<string, number>;
  totalAccruedUsd: number;
  totalClaimedUsd: number;
  totalUsersReferred: number;
}

export interface ReferralRewardsResponse {
  message: string;
  result: ReferralRewards;
}

/**
 * Fetch user's referral rewards
 */
export async function getReferralRewards(): Promise<{ data?: ReferralRewardsResponse; error?: string }> {
  return apiRequest<ReferralRewardsResponse>("/referral/get-rewards", {
    method: "GET",
  });
}

/**
 * Calculate TOTO display values from rewards response
 */
export function calculateTotoValues(rewards: ReferralRewards | null): {
  claimed: number;
  claimable: number;
  total: number;
} {
  if (!rewards) {
    return { claimed: 0, claimable: 0, total: 0 };
  }
  
  const claimed = rewards.claimedRewards?.TOTO || 0;
  const accrued = rewards.accruedRewards?.TOTO || 0;
  const claimable = Math.max(0, accrued - claimed);
  
  return {
    claimed,
    claimable,
    total: accrued,
  };
}

// Claim rewards types
export interface ClaimRewardsPayload {
  claimCoin: string;
  walletAddress: string;
}

export interface ClaimRewardsResponse {
  txData: {
    from: string;
    to: string;
    data: string;
  };
  validity: number;
}

/**
 * Claim referral rewards
 */
export async function claimReferralRewards(
  payload: ClaimRewardsPayload
): Promise<{ data?: ClaimRewardsResponse; error?: string }> {
  return apiRequest<ClaimRewardsResponse>("/referral/claim-rewards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==================== COMMODITY PRICES API ====================

export interface CommodityPricesResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: {
    XAU: number; // Gold price per troy ounce
    XAG: number; // Silver price per troy ounce
    XPT: number; // Platinum price per troy ounce
  };
}

/**
 * Get live commodity prices (Gold, Silver, Platinum)
 * Prices are updated every 8 hours on the backend
 */
export async function getCommodityPrices(): Promise<{ data?: CommodityPricesResponse; error?: string }> {
  return apiRequestPublic<CommodityPricesResponse>("/commodities/livePrices", {
    method: "GET",
  });
}
