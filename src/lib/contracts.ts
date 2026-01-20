/**
 * Smart Contract Addresses Configuration
 * 
 * This file contains all contract addresses for different chains.
 * Update these addresses when deploying to new environments.
 */

// Sepolia Testnet (chainId: 11155111)
export const SEPOLIA_CONTRACTS = {
  // Core Tiamonds contracts
  TIAMONDS: "0x616e98AB02E5B23E45Cf9ef22925Cd0C4c49c3F9",
  SALE_ADDRESS: "0xE27A07E5C458Ff1156426B7b0C2806C82bf0b254",
  SPECIAL_SALE_ADDRESS: "0x79CFE99734e1298B5c8bda0151e5b06D5183FB7e",
  ESCROW_SALE_ADDRESS: "0x9e7b28Fb186905B7d13166C53E93187e6BCcfCD7",
  REWARDS_VAULT: "0x91D55c8bf1F7f81127F155E1727Ef06347Df239d",
  SWAPPER: "0xF635813E89262be3b2e28ae09E2850e68fC12913",
  
  // Token contracts
  LCX_TOKEN: "0x98d99c88D31C27C5a591Fe7F023F9DB0B37E4B3b",
  TIA_TOKEN: "0x6d8916ef96dE11c7Cd998791b88998f54287FbD3",
  USDT: "0x94a2f3eB448C9Aa9C272D616fC0c2796098687f2",
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  TOTO: "0x82f2Dc40FD62Dc5412d09CA6efcD701316887f67",
  PAXG: "0xf373E8823F5Cd2B7224bD58004801693e2Ac6017",
  XAUT: "0x70fdD0a7F9f9249B2161e6a9D414b82937FC2db9",
  
  // Vesting contracts
  LCX_VESTING: "0x7F596620e091198b4f18072C74b7E1ACE42Bd07B",
  TIA_VESTING: "0x1547DcD50e4e43151f0dE22c88753bB18CA1A63E",
} as const;

// Ethereum Mainnet (chainId: 1)
export const MAINNET_CONTRACTS = {
  // Core Tiamonds contracts - Replace with mainnet addresses
  TIAMONDS: "0x0000000000000000000000000000000000000000",
  SALE_ADDRESS: "0x0000000000000000000000000000000000000000",
  SPECIAL_SALE_ADDRESS: "0x0000000000000000000000000000000000000000",
  ESCROW_SALE_ADDRESS: "0x0000000000000000000000000000000000000000",
  REWARDS_VAULT: "0x0000000000000000000000000000000000000000",
  SWAPPER: "0x0000000000000000000000000000000000000000",
  
  // Token contracts (mainnet addresses)
  LCX_TOKEN: "0x037A54AaB062628C9Bbae1FDB1583c195585fe41",
  TIA_TOKEN: "0x0000000000000000000000000000000000000000",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  TOTO: "0x0000000000000000000000000000000000000000",
  PAXG: "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
  XAUT: "0x68749665FF8D2d112Fa859AA293F07A622782F38",
  
  // Vesting contracts
  LCX_VESTING: "0x0000000000000000000000000000000000000000",
  TIA_VESTING: "0x0000000000000000000000000000000000000000",
} as const;

// Chain ID to contracts mapping
export const CONTRACTS_BY_CHAIN: Record<number, typeof SEPOLIA_CONTRACTS> = {
  1: MAINNET_CONTRACTS,
  11155111: SEPOLIA_CONTRACTS,
};

// Token symbol to contract key mapping
export const TOKEN_CONTRACT_KEYS: Record<string, keyof typeof SEPOLIA_CONTRACTS> = {
  LCX: "LCX_TOKEN",
  TIA: "TIA_TOKEN",
  USDT: "USDT",
  USDC: "USDC",
  WETH: "WETH",
  TOTO: "TOTO",
  PAXG: "PAXG",
  XAUT: "XAUT",
};

// Token decimals
export const TOKEN_DECIMALS: Record<string, number> = {
  LCX: 18,
  TIA: 18,
  USDT: 6,
  USDC: 6,
  WETH: 18,
  ETH: 18,
  TOTO: 18,
  PAXG: 18,
  XAUT: 6,
  USD: 6,
};

// Coins that don't require ERC-20 approval (native tokens)
export const NATIVE_COINS = ["ETH"];

/**
 * Get token contract address for a specific chain
 */
export function getTokenAddress(chainId: number, tokenSymbol: string): `0x${string}` | null {
  const contracts = CONTRACTS_BY_CHAIN[chainId];
  if (!contracts) return null;
  
  const contractKey = TOKEN_CONTRACT_KEYS[tokenSymbol.toUpperCase()];
  if (!contractKey) return null;
  
  const address = contracts[contractKey];
  if (!address || address === "0x0000000000000000000000000000000000000000") return null;
  
  return address as `0x${string}`;
}

/**
 * Get escrow contract address for a specific chain
 */
export function getEscrowAddress(chainId: number): `0x${string}` | null {
  const contracts = CONTRACTS_BY_CHAIN[chainId];
  if (!contracts) return null;
  
  const address = contracts.ESCROW_SALE_ADDRESS;
  if (!address || address === "0x0000000000000000000000000000000000000000") return null;
  
  return address as `0x${string}`;
}

/**
 * Check if a coin requires ERC-20 approval
 */
export function requiresApproval(tokenSymbol: string): boolean {
  return !NATIVE_COINS.includes(tokenSymbol.toUpperCase());
}

/**
 * Get token decimals
 */
export function getTokenDecimals(tokenSymbol: string): number {
  return TOKEN_DECIMALS[tokenSymbol.toUpperCase()] || 18;
}

