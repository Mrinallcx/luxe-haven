import { apiRequest } from "./api";
import { keccak256, toBytes } from "viem";

// User profile response
export interface UserProfileResponse {
  msg: string;
  result: {
    emailId: string;
    blockchainId: string;
    walletAddressList?: string[];
    // Add more fields as needed
  };
}

/**
 * Fetch user profile to get blockchainId and wallet list
 */
export async function getUserProfile(): Promise<{ data?: UserProfileResponse; error?: string }> {
  return apiRequest<UserProfileResponse>("/user", {
    method: "GET",
  });
}

// Wallet connection log payload
export interface WalletConnectionPayload {
  walletAddress: string;
  walletName: string;
  chain: string;
}

export interface WalletConnectionResponse {
  msg: string;
  success?: boolean;
}

// Add wallet address with signature payload
export interface AddWalletAddressPayload {
  walletAddress: string;
  walletName: "METAMASK" | "COINBASE WALLET" | "WALLETCONNECT";
  chain: "ETHEREUM" | "CARDANO";
  timestamp: number;
  signature: string;
}

export interface AddWalletAddressResponse {
  msg: string;
}

/**
 * Log wallet connection to the backend (analytics)
 * Called after successful wallet connection
 */
export async function logWalletConnection(
  payload: WalletConnectionPayload
): Promise<{ data?: WalletConnectionResponse; error?: string }> {
  return apiRequest<WalletConnectionResponse>("/analytics/log/wallet-connection", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Add wallet address to user account with signature verification
 * Called after user signs the verification message
 */
export async function addUserWalletAddress(
  payload: AddWalletAddressPayload
): Promise<{ data?: AddWalletAddressResponse; error?: string }> {
  return apiRequest<AddWalletAddressResponse>("/user/add-user-wallet-address", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Generate SHA3 hash (keccak256) similar to Web3.utils.sha3Raw
 */
function sha3Raw(value: string): string {
  const hash = keccak256(toBytes(value));
  return hash;
}

/**
 * Generate the message that needs to be signed by the wallet
 * Must match exactly with what the backend expects
 */
export function generateWalletSignMessage(
  chain: string,
  walletAddress: string,
  walletName: string,
  timestamp: number,
  blockchainId: string
): string {
  const secret = sha3Raw(String(blockchainId) + timestamp);
  
  const message = [
    "Welcome to Tiamonds. Please sign this message so that we can verify your wallet address.",
    `Chain: ${chain}`,
    `Wallet address: ${walletAddress}`,
    `Wallet name: ${walletName}`,
    `Timestamp: ${timestamp}`,
    `Secret: ${secret}`
  ].join("\n");
  
  return message;
}

/**
 * Get the current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Map connector ID to wallet name for backend
 */
export function getWalletNameForBackend(connectorId: string): "METAMASK" | "COINBASE WALLET" | "WALLETCONNECT" {
  const connectorLower = connectorId.toLowerCase();
  if (connectorLower.includes("metamask")) return "METAMASK";
  if (connectorLower.includes("coinbase")) return "COINBASE WALLET";
  if (connectorLower.includes("walletconnect")) return "WALLETCONNECT";
  return "METAMASK"; // Default
}
