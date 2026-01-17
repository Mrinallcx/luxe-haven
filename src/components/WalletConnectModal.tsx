import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet, Network, EthereumWallet, CardanoWallet } from "@/contexts/WalletContext";
import { cn } from "@/lib/utils";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ethereumWallets: { id: EthereumWallet; name: string; icon: string }[] = [
  { id: "metamask", name: "MetaMask", icon: "🦊" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
  { id: "coinbase", name: "Coinbase", icon: "🔵" },
];

const cardanoWallets: { id: CardanoWallet; name: string; icon: string }[] = [
  { id: "lace", name: "Lace", icon: "🎴" },
  { id: "eternl", name: "Eternl", icon: "♾️" },
];

const WalletConnectModal = ({ open, onOpenChange }: WalletConnectModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("ethereum");
  const [selectedWallet, setSelectedWallet] = useState<EthereumWallet | CardanoWallet | null>(null);
  const { connect } = useWallet();

  const wallets = selectedNetwork === "ethereum" ? ethereumWallets : cardanoWallets;

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network);
    setSelectedWallet(null);
  };

  const handleConnect = () => {
    if (selectedWallet) {
      connect(selectedNetwork, selectedWallet);
      onOpenChange(false);
      setSelectedWallet(null);
      setSelectedNetwork("ethereum");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedWallet(null);
    setSelectedNetwork("ethereum");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif font-light text-xl tracking-wide">
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        {/* Network Toggle */}
        <div className="flex justify-center gap-2 p-1 bg-muted rounded-full">
          <button
            onClick={() => handleNetworkChange("ethereum")}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-200",
              selectedNetwork === "ethereum"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Ethereum
          </button>
          <button
            onClick={() => handleNetworkChange("cardano")}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-200",
              selectedNetwork === "cardano"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Cardano
          </button>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                selectedWallet === wallet.id
                  ? "border-gold bg-gold/10"
                  : "border-border hover:border-gold/50 hover:bg-muted/50"
              )}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="text-sm font-medium tracking-wide">{wallet.name}</span>
              {selectedWallet === wallet.id && (
                <span className="ml-auto text-gold text-sm">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Connect Button */}
        <Button
          variant="premium"
          className="w-full mt-4"
          onClick={handleConnect}
          disabled={!selectedWallet}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
