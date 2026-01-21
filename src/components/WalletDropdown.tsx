import { useBalance, useChainId } from "wagmi";
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";
import { APP_ENV, REQUIRED_CHAIN_ID, REQUIRED_CHAIN_NAME } from "@/lib/wagmi-config";
import { SEPOLIA_CONTRACTS, MAINNET_CONTRACTS } from "@/lib/contracts";
import { getEtherscanUrl } from "@/utils/product-helpers";

// Token icons
import metamaskIcon from "@/assets/wallet-icons/metamask.svg";
import walletconnectIcon from "@/assets/wallet-icons/walletconnect.svg";
import coinbaseIcon from "@/assets/wallet-icons/coinbase.svg";

interface WalletDropdownProps {
  className?: string;
}

// Get token addresses based on environment
const getTokenAddresses = () => {
  if (APP_ENV === 'prod') {
    return {
      LCX: MAINNET_CONTRACTS.LCX_TOKEN as `0x${string}`,
      WETH: MAINNET_CONTRACTS.WETH as `0x${string}`,
    };
  }
  return {
    LCX: SEPOLIA_CONTRACTS.LCX_TOKEN as `0x${string}`,
    WETH: SEPOLIA_CONTRACTS.WETH as `0x${string}`,
  };
};

const WalletDropdown = ({ className }: WalletDropdownProps) => {
  const { isConnected, walletAddress, walletName, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  
  const TOKENS = getTokenAddresses();

  // Fetch ETH balance for current network
  const { data: ethBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    chainId: REQUIRED_CHAIN_ID,
  });

  // Fetch LCX balance for current network
  const { data: lcxBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    token: TOKENS.LCX,
    chainId: REQUIRED_CHAIN_ID,
  });

  // Fetch WETH balance for current network
  const { data: wethBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    token: TOKENS.WETH,
    chainId: REQUIRED_CHAIN_ID,
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  };

  const formatBalance = (value: string | undefined, decimals: number = 4) => {
    if (!value) return "0";
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 0.0001) return "<0.0001";
    return num.toFixed(decimals);
  };

  const getWalletIcon = () => {
    const name = (walletName || "").toUpperCase();
    
    if (name.includes("METAMASK")) {
      return metamaskIcon;
    }
    if (name.includes("COINBASE")) {
      return coinbaseIcon;
    }
    if (name.includes("WALLETCONNECT")) {
      return walletconnectIcon;
    }
    
    // Default fallback
    return metamaskIcon;
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    const etherscanUrl = getEtherscanUrl();
    window.open(`${etherscanUrl}/address/${walletAddress}`, "_blank");
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  if (!isConnected || !walletAddress) {
    return null;
  }

  // Check if connected to wrong network
  const isWrongNetwork = chainId !== REQUIRED_CHAIN_ID;

  // Calculate USD values (placeholder - would need price feed)
  const ethUsdPrice = 0; // Would come from a price API
  const lcxUsdPrice = 0;
  const wethUsdPrice = 0;

  const ethUsdValue = ethBalance ? parseFloat(ethBalance.formatted) * ethUsdPrice : 0;
  const lcxUsdValue = lcxBalance ? parseFloat(lcxBalance.formatted) * lcxUsdPrice : 0;
  const wethUsdValue = wethBalance ? parseFloat(wethBalance.formatted) * wethUsdPrice : 0;

  // Network badge text
  const networkBadge = APP_ENV === 'prod' ? 'Mainnet' : 'Sepolia';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full gap-2 font-mono text-xs ${className}`}
        >
          <Wallet className="w-4 h-4" />
          {formatAddress(walletAddress)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-background border border-border rounded-xl shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Your Wallet
          </p>
          <div className="flex items-center gap-3">
            <img
              src={getWalletIcon()}
              alt={walletName || "Wallet"}
              className="w-8 h-8 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {walletName || "Connected"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-muted-foreground">
                  {formatAddress(walletAddress)}
                </p>
                <button
                  onClick={copyAddress}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={openEtherscan}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wrong Network Warning */}
        {isWrongNetwork && (
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/20">
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              Please switch to {REQUIRED_CHAIN_NAME} to see balances
            </p>
          </div>
        )}

        {/* LCX Balance - Highlighted */}
        <div className="p-4 bg-gold/5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-xs font-bold text-gold">LCX</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {formatBalance(lcxBalance?.formatted)} LCX
              </p>
              <p className="text-xs text-muted-foreground">
                (${lcxUsdValue.toFixed(2)} USD)
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
            Wallet Balance
          </p>
        </div>

        {/* Token List */}
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Tokens
          </p>
          <div className="space-y-3">
            {/* ETH */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#627EEA]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[#627EEA]">ETH</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">ETH</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                    {networkBadge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatBalance(ethBalance?.formatted)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  ${ethUsdValue.toFixed(2)} USD
                </p>
              </div>
            </div>

            {/* WETH */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EC4899]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[#EC4899]">WETH</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">WETH</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                    {networkBadge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatBalance(wethBalance?.formatted)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  ${wethUsdValue.toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disconnect Button */}
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDisconnect}
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletDropdown;
