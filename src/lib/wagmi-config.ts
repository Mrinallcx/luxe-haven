import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Get project ID from environment variable or use a placeholder
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Environment: 'dev' uses Sepolia testnet, 'prod' uses Ethereum mainnet
export const APP_ENV = (import.meta.env.VITE_APP_ENV || 'dev') as 'dev' | 'prod';

// Get the correct chain based on environment
export const ACTIVE_CHAIN = APP_ENV === 'prod' ? mainnet : sepolia;
export const REQUIRED_CHAIN_ID = ACTIVE_CHAIN.id;
export const REQUIRED_CHAIN_NAME = ACTIVE_CHAIN.name;

export const wagmiConfig = getDefaultConfig({
  appName: 'Toto Finance',
  projectId,
  chains: [ACTIVE_CHAIN],
  ssr: false,
});
