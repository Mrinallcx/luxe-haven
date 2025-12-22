import { createContext, useContext, useState, ReactNode } from "react";

export type Network = "ethereum" | "cardano";
export type EthereumWallet = "metamask" | "walletconnect" | "coinbase";
export type CardanoWallet = "lace" | "eternl";
export type WalletType = EthereumWallet | CardanoWallet;

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  network: Network | null;
  walletType: WalletType | null;
  connect: (network: Network, wallet: WalletType) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock function to generate a wallet address
const generateMockAddress = (network: Network): string => {
  if (network === "ethereum") {
    return `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;
  } else {
    return `addr1${Array.from({ length: 50 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;
  }
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  const connect = (selectedNetwork: Network, selectedWallet: WalletType) => {
    const address = generateMockAddress(selectedNetwork);
    setWalletAddress(address);
    setNetwork(selectedNetwork);
    setWalletType(selectedWallet);
    setIsConnected(true);
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setNetwork(null);
    setWalletType(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected, walletAddress, network, walletType, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
