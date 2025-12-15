import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import UniversalSearchBar from "@/components/UniversalSearchBar";
import { useCart } from "@/contexts/CartContext";
import SignInModal from "@/components/SignInModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
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
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-serif text-xl lg:text-2xl tracking-wide">
            MAISON
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
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <UniversalSearchBar className="hidden lg:block w-64" />
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
                    onClick={handleSignOut}
                    className="w-full px-4 py-2.5 text-sm tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
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
      <SignInModal open={isSignInOpen} onOpenChange={setIsSignInOpen} onSignIn={handleSignIn} />
    </header>
  );
};

export default Header;