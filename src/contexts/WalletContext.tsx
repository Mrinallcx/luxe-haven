import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { 
  logWalletConnection, 
  addUserWalletAddress, 
  generateWalletSignMessage,
  getCurrentTimestamp,
  getWalletNameForBackend,
  getUserProfile
} from "@/lib/wallet-api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Network = "ethereum" | "cardano";
export type WalletName = "METAMASK" | "COINBASE WALLET" | "WALLETCONNECT";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  network: Network | null;
  walletName: WalletName | null;
  isRegistering: boolean;
  registrationError: string | null;
  blockchainId: string | null;
  isAlreadyRegistered: boolean;
  isFetchingProfile: boolean;
  disconnect: () => void;
  registerWallet: () => Promise<boolean>;
  fetchBlockchainId: () => Promise<string | null>;
  checkWalletRegistration: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Get wallet name from connector ID
const getWalletNameFromConnector = (connectorId: string): WalletName => {
  return getWalletNameForBackend(connectorId);
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { isSignedIn } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [blockchainId, setBlockchainId] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Fetch blockchainId from user profile
  const fetchBlockchainId = useCallback(async (): Promise<string | null> => {
    if (!isSignedIn) {
      console.log("User not signed in, cannot fetch blockchainId");
      return null;
    }

    setIsFetchingProfile(true);
    try {
      const response = await getUserProfile();
      
      if (response.error) {
        console.error("Failed to fetch user profile:", response.error);
        return null;
      }

      const id = response.data?.result?.blockchainId || null;
      setBlockchainId(id);
      
      // Also check if current wallet is already registered
      if (address && response.data?.result?.walletAddressList) {
        const walletList = response.data.result.walletAddressList;
        const isRegistered = walletList.some(
          (addr) => addr.toLowerCase() === address.toLowerCase()
        );
        setIsAlreadyRegistered(isRegistered);
      }

      return id;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    } finally {
      setIsFetchingProfile(false);
    }
  }, [isSignedIn, address]);

  // Check if wallet is already registered
  const checkWalletRegistration = useCallback(async (): Promise<boolean> => {
    if (!address || !isSignedIn) return false;

    try {
      const response = await getUserProfile();
      
      if (response.data?.result?.walletAddressList) {
        const walletList = response.data.result.walletAddressList;
        const isRegistered = walletList.some(
          (addr) => addr.toLowerCase() === address.toLowerCase()
        );
        setIsAlreadyRegistered(isRegistered);
        return isRegistered;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking wallet registration:", error);
      return false;
    }
  }, [address, isSignedIn]);

  // Register wallet with backend (sign message and verify)
  const registerWallet = useCallback(async (): Promise<boolean> => {
    if (!address || !connector) {
      console.error("Missing wallet address or connector");
      setRegistrationError("Wallet connection failed");
      return false;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    const walletName = getWalletNameFromConnector(connector.id);
    const chain = "ETHEREUM";

    try {
      // First, check if wallet is already registered (no signature needed)
      console.log("Checking if wallet is already registered...");
      const profileResponse = await getUserProfile();
      
      if (profileResponse.data?.result?.walletAddressList) {
        const walletList = profileResponse.data.result.walletAddressList;
        const isAlreadyInList = walletList.some(
          (addr) => addr.toLowerCase() === address.toLowerCase()
        );
        
        if (isAlreadyInList) {
          console.log("Wallet already registered - no signature needed");
          setIsAlreadyRegistered(true);
          toast.success("Wallet connected successfully!");
          
          // Log the connection for analytics
          await logWalletConnection({
            walletAddress: address,
            walletName,
            chain,
          });
          
          return true;
        }
      }

      // Wallet not registered, need to sign
      console.log("Wallet not registered, proceeding with signature verification...");

      // Get blockchainId from the profile response or fetch it
      let currentBlockchainId = profileResponse.data?.result?.blockchainId || blockchainId;
      if (!currentBlockchainId) {
        console.log("Fetching blockchainId from user profile...");
        currentBlockchainId = await fetchBlockchainId();
      }

      if (!currentBlockchainId) {
        console.error("No blockchainId available");
        setRegistrationError("Unable to fetch account data. Please try again.");
        return false;
      }

      // Update blockchainId state
      setBlockchainId(currentBlockchainId);

      const timestamp = getCurrentTimestamp();

      // Generate the message to sign
      const message = generateWalletSignMessage(
        chain,
        address,
        walletName,
        timestamp,
        currentBlockchainId
      );

      console.log("Requesting signature for message...");

      // Request signature from wallet
      const signature = await signMessageAsync({ message });

      console.log("Signature obtained, registering with backend...");

      // Send to backend for verification
      const response = await addUserWalletAddress({
        walletAddress: address,
        walletName,
        chain,
        timestamp,
        signature,
      });

      if (response.error) {
        // Check if it's "Already exists" which is fine
        if (response.error.includes("Already exists") || response.error.includes("already exists")) {
          console.log("Wallet already registered (backend confirmed)");
          setIsAlreadyRegistered(true);
          toast.success("Wallet connected successfully!");
          
          // Log the connection for analytics
          await logWalletConnection({
            walletAddress: address,
            walletName,
            chain,
          });
          
          return true;
        }
        
        console.error("Failed to register wallet:", response.error);
        setRegistrationError(response.error);
        toast.error("Failed to verify wallet. Please try again.");
        return false;
      }

      console.log("Wallet registered successfully");
      setIsAlreadyRegistered(true);
      toast.success("Wallet connected and verified!");

      // Log the connection for analytics
      await logWalletConnection({
        walletAddress: address,
        walletName,
        chain,
      });

      return true;
    } catch (error: unknown) {
      console.error("Error during wallet registration:", error);
      
      // Handle user rejection
      if (error instanceof Error && error.message.includes("rejected")) {
        setRegistrationError("Signature request was rejected");
        toast.error("You need to sign the message to verify your wallet");
      } else {
        setRegistrationError("Failed to verify wallet");
        toast.error("Failed to verify wallet. Please try again.");
      }
      
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, [address, connector, blockchainId, signMessageAsync, fetchBlockchainId]);

  const handleDisconnect = () => {
    wagmiDisconnect();
    setRegistrationError(null);
    setBlockchainId(null);
    setIsAlreadyRegistered(false);
  };

  const walletName = connector ? getWalletNameFromConnector(connector.id) : null;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress: address || null,
        network: isConnected ? "ethereum" : null,
        walletName,
        isRegistering,
        registrationError,
        blockchainId,
        isAlreadyRegistered,
        isFetchingProfile,
        disconnect: handleDisconnect,
        registerWallet,
        fetchBlockchainId,
        checkWalletRegistration,
      }}
    >
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
