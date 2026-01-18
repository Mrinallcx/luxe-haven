import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Get project ID from environment variable or use a placeholder
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const wagmiConfig = getDefaultConfig({
  appName: 'MAISON - Luxury Assets',
  projectId,
  chains: [mainnet, sepolia],
  ssr: false,
});

