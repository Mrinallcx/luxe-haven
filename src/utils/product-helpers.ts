// Etherscan URL from environment
export const ETHERSCAN_URL = import.meta.env.VITE_ETHERSCAN_URL || "https://sepolia.etherscan.io/";

/**
 * Truncate wallet addresses for display
 */
export const truncateAddress = (address: string) => {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format transaction date from unix timestamp
 */
export const formatTxDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get Etherscan transaction URL
 */
export const getEtherscanTxUrl = (hash: string) => {
  const baseUrl = ETHERSCAN_URL.endsWith('/') ? ETHERSCAN_URL : `${ETHERSCAN_URL}/`;
  return `${baseUrl}tx/${hash}`;
};

/**
 * Get Etherscan address URL
 */
export const getEtherscanAddressUrl = (address: string) => {
  const baseUrl = ETHERSCAN_URL.endsWith('/') ? ETHERSCAN_URL : `${ETHERSCAN_URL}/`;
  return `${baseUrl}address/${address}`;
};

/**
 * Category-specific info box content
 */
export const getCategoryInfoBox = (category: string): { title: string; description: string } => {
  const categoryLower = category.toLowerCase();
  
  switch (categoryLower) {
    case "diamonds":
      return {
        title: "Certified Precious Asset",
        description: "Own a GIA-certified natural diamond with verified provenance and conflict-free origin. Securely stored in a high-security vault and fully insured, with digital ownership enabling seamless transfer, gifting, or physical redemption at any time."
      };
    case "gold":
      return {
        title: "Own Real Gold. Tokenized",
        description: "Own real Swiss gold - 1 ounce of 99.99% pure gold, tokenized 1:1 as an NFT. Securely stored in Liechtenstein with free insurance and full redemption rights. Earn TOTO rewards just by holding your gold NFT."
      };
    case "silver":
      return {
        title: "Own Real Silver. Tokenized",
        description: "Own real Swiss silver - 1 ounce of 99.9% pure silver, tokenized 1:1 as an NFT. Securely stored in Liechtenstein with free insurance, redemption rights, and passive TOTO rewards for simply holding your silver NFT."
      };
    case "sapphire":
      return {
        title: "Own Real Sapphires. Tokenized.",
        description: "Own rare, unheated Sri Lankan sapphires, tokenized as NFTs and certified by leading gem labs. Securely stored and insured in Liechtenstein, with the option to redeem the physical stone anytime. Earn TOTO rewards simply by holding your sapphire NFT."
      };
    case "platinum":
      return {
        title: "Own Real Platinum. Tokenized.",
        description: "Own real Swiss platinum - 1 ounce of 999.5/1000 fineness pure platinum, tokenized 1:1 as an NFT. Securely stored in Liechtenstein with free insurance, full redemption rights, and TOTO rewards earned just by holding your platinum NFT."
      };
    default:
      return {
        title: "Certified Precious Asset",
        description: `Own certified ${category.toLowerCase()} stored securely with free insurance. Trade, gift, or redeem your asset anytime - with full transparency and traceability.`
      };
  }
};

/**
 * Format time remaining for countdown
 */
export const formatTimeRemaining = (expiresAt: number) => {
  const now = Date.now();
  const diff = expiresAt - now;
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

/**
 * Mock offers with expiration times
 */
export const getInitialOffers = () => [
  { id: 1, priceMultiplier: 0.85, token: "LCX", expiresAt: Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) },
  { id: 2, priceMultiplier: 0.78, token: "USDT", expiresAt: Date.now() + (5 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) },
  { id: 3, priceMultiplier: 0.72, token: "wETH", expiresAt: Date.now() + (12 * 60 * 60 * 1000) + (30 * 60 * 1000) },
];

export type OfferType = ReturnType<typeof getInitialOffers>[0];

/**
 * Normalize image URL for consistent handling
 * Handles S3 URLs with URL-encoded characters (e.g., + for spaces, %23 for #)
 * Ensures URLs are properly formatted for use in img tags and OG meta tags
 */
export const normalizeImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) {
    return "";
  }

  // Trim whitespace
  let url = imageUrl.trim();

  // If already an absolute URL (http/https), return as-is
  // S3 URLs with URL-encoded characters should work as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Convert relative URLs to absolute
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (url.startsWith("/")) {
    return `${origin}${url}`;
  }

  return `${origin}/${url}`;
};

