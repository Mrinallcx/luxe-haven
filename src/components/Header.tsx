import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, ChevronDown, LogOut, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import UniversalSearchBar from "@/components/UniversalSearchBar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import SignInModal from "@/components/SignInModal";
import DemandUsModal from "@/components/DemandUsModal";
import WalletConnectModal from "@/components/WalletConnectModal";
import WalletDropdown from "@/components/WalletDropdown";
import totoFinanceLogo from "@/assets/toto finance logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isDemandUsOpen, setIsDemandUsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { getCartCount } = useCart();
  const { isSignedIn, signIn, signOut } = useAuth();
  const { isConnected, walletAddress, disconnect } = useWallet();
  const cartCount = getCartCount();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const assetLinks = [
    { label: "Diamonds", href: "/category/diamonds" },
    { label: "Gold", href: "/category/gold" },
    { label: "Silver", href: "/category/silver" },
    { label: "Platinum", href: "/category/platinum" },
    { label: "Sapphire", href: "/category/sapphire" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center h-full">
            <img 
              src={totoFinanceLogo} 
              alt="Toto Finance" 
              className="h-8 lg:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Blog
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 outline-none">
                Asset
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border rounded-xl p-2 min-w-[160px] shadow-lg">
                {assetLinks.map((link) => (
                  <DropdownMenuItem key={link.label} asChild>
                    <Link
                      to={link.href}
                      className="w-full px-4 py-2.5 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setIsDemandUsOpen(true)}
              className="flex items-center gap-1.5 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4" />
              Demand Us
            </button>
          </nav>

          {/* Actions - Order: Search, Wallet, Cart, Account */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search */}
            <UniversalSearchBar className="hidden lg:block w-64" />
            
            {/* Wallet */}
            {isSignedIn && (
              !isConnected ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden lg:flex rounded-full gap-2"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              ) : (
                <WalletDropdown className="hidden lg:flex" />
              )
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-charcoal text-[10px] flex items-center justify-center rounded-full font-medium">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account (far right) */}
            {!isSignedIn ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden lg:flex rounded-full"
                onClick={() => setIsSignInOpen(true)}
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border rounded-xl p-2 min-w-[160px] shadow-lg" align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account"
                      className="w-full px-4 py-2.5 text-sm tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="w-full px-4 py-2.5 text-sm tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDemandUsOpen(true);
                }}
                className="flex items-center gap-1.5 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                <Sparkles className="w-4 h-4" />
                Demand Us
              </button>
              <div className="text-sm tracking-wider uppercase text-foreground font-medium pt-2">
                Assets
              </div>
              {assetLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-2 space-y-3">
                <UniversalSearchBar className="w-full" />
                {!isSignedIn ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSignInOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  <>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                        <User className="w-4 h-4" />
                        Account
                      </Button>
                    </Link>
                    {!isConnected ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 w-full justify-start rounded-full"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsWalletModalOpen(true);
                        }}
                      >
                        <Wallet className="w-4 h-4" />
                        Connect Wallet
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                          <Wallet className="w-4 h-4 text-gold" />
                          <span className="text-xs font-mono text-foreground">
                            {formatAddress(walletAddress!)}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 w-full justify-start text-destructive hover:text-destructive"
                          onClick={() => {
                            setIsMenuOpen(false);
                            disconnect();
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Disconnect Wallet
                        </Button>
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      <SignInModal 
        open={isSignInOpen} 
        onOpenChange={setIsSignInOpen} 
        onSignIn={(user) => signIn(user)} 
      />
      
      {/* Demand Us Modal */}
      <DemandUsModal open={isDemandUsOpen} onOpenChange={setIsDemandUsOpen} />

      {/* Wallet Connect Modal */}
      <WalletConnectModal open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
    </header>
  );
};

export default Header;
