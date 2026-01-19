import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gavel, Activity, Users, Heart, Copy, Check, Clock, Loader2, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import AccountProductCard from "@/components/AccountProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import ListingModal from "@/components/ListingModal";
import ClaimTotoModal from "@/components/ClaimTotoModal";
import totoAccountBanner from "@/assets/toto account banner.webp";
import userAvatar from "@/assets/user avatar.webp";
import { getUserOwnedAssets, getUserActiveBids, normalizeUserAsset, UserOwnedAsset, getReferralRewards, calculateTotoValues } from "@/lib/market-api";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  memberSince: "Jan 2024",
  avatar: userAvatar,
  banner: totoAccountBanner,
};



// Extended product type for owned assets
type OwnedAsset = Product & {
  _id?: string;
  owner?: string;
  chain?: string;
  mintStatus?: string;
  saleType?: string;
};

const Account = () => {
  const [copied, setCopied] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  // Wishlist uses grid view only
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { walletAddress } = useWallet();
  const { toast } = useToast();
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [isClaimHovered, setIsClaimHovered] = useState(false);
  
  // Owned assets state
  const [ownedAssets, setOwnedAssets] = useState<OwnedAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  // Active bids state
  const [activeBids, setActiveBids] = useState<OwnedAsset[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);

  // Referral rewards state
  const [totoRewards, setTotoRewards] = useState({ claimed: 0, claimable: 0, total: 0 });
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

  // Fetch owned assets when wallet address is available
  useEffect(() => {
    const fetchOwnedAssets = async () => {
      if (!walletAddress) {
        setOwnedAssets([]);
        return;
      }

      setIsLoadingAssets(true);
      setAssetsError(null);

      try {
        const response = await getUserOwnedAssets(walletAddress);
        
        if (response.error) {
          console.error("Failed to fetch owned assets:", response.error);
          setAssetsError(response.error);
          setOwnedAssets([]);
          return;
        }

        if (response.data?.result && response.data.result.length > 0) {
          const normalizedAssets = response.data.result.map((asset: UserOwnedAsset) => {
            const normalized = normalizeUserAsset(asset);
            return {
              ...normalized,
              id: normalized.id,
              _id: normalized._id,
            } as OwnedAsset;
          });
          setOwnedAssets(normalizedAssets);
        } else {
          setOwnedAssets([]);
        }
      } catch (error) {
        console.error("Error fetching owned assets:", error);
        setAssetsError("Failed to load owned assets");
        setOwnedAssets([]);
      } finally {
        setIsLoadingAssets(false);
      }
    };

    fetchOwnedAssets();
  }, [walletAddress]);

  // Fetch active bids when wallet address is available
  useEffect(() => {
    const fetchActiveBids = async () => {
      if (!walletAddress) {
        setActiveBids([]);
        return;
      }

      setIsLoadingBids(true);
      setBidsError(null);

      try {
        const response = await getUserActiveBids(walletAddress);
        
        if (response.error) {
          console.error("Failed to fetch active bids:", response.error);
          setBidsError(response.error);
          setActiveBids([]);
          return;
        }

        if (response.data?.result && response.data.result.length > 0) {
          const normalizedBids = response.data.result.map((asset: UserOwnedAsset) => {
            const normalized = normalizeUserAsset(asset);
            return {
              ...normalized,
              id: normalized.id,
              _id: normalized._id,
            } as OwnedAsset;
          });
          setActiveBids(normalizedBids);
        } else {
          setActiveBids([]);
        }
      } catch (error) {
        console.error("Error fetching active bids:", error);
        setBidsError("Failed to load active bids");
        setActiveBids([]);
      } finally {
        setIsLoadingBids(false);
      }
    };

    fetchActiveBids();
  }, [walletAddress]);

  // Fetch referral rewards
  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoadingRewards(true);
      try {
        const response = await getReferralRewards();
        if (response.data?.result) {
          const totoValues = calculateTotoValues(response.data.result);
          setTotoRewards(totoValues);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setIsLoadingRewards(false);
      }
    };

    fetchRewards();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const displayAddress = walletAddress ? formatAddress(walletAddress) : "0x0000...0000";

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWalletCopied(true);
      toast({
        title: "Wallet address copied",
        description: "Wallet address has been copied to clipboard.",
      });
      setTimeout(() => setWalletCopied(false), 2000);
    }
  };

  const handleListForSale = (product: Product) => {
    setSelectedProduct(product);
    setListingModalOpen(true);
  };

  const handleListingComplete = () => {
    toast({
      title: "Listing created",
      description: `${selectedProduct?.name} has been listed for sale.`,
    });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText("REFERRAL_CODE"); // Placeholder - API integration pending
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner & Profile Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
          {/* Banner with rounded corners */}
          <div className="relative h-40 md:h-52 rounded-xl overflow-hidden bg-muted/30">
            <img
              src={userData.banner}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 tracking-wider uppercase text-xs"
            >
              Edit
            </Button>
          </div>

          {/* Profile Row with Balance */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-4">
            {/* Left: Avatar + Name + Action Buttons */}
            <div className="flex flex-col">
              {/* Avatar overlapping banner */}
              <div className="relative -mt-16 ml-4 mb-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                    <AvatarImage src={userData.avatar} alt={displayAddress} />
                    <AvatarFallback className="bg-gold/20 text-gold text-xl font-serif font-light">
                      {displayAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Wallet Address + Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4">
                <Badge 
                  variant="outline" 
                  className="px-3 py-1.5 text-sm font-mono font-normal border-border cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-2"
                  onClick={copyWalletAddress}
                >
                  <span>{displayAddress}</span>
                  {walletCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Visit LCX
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Masterdex
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                    asChild
                  >
                    <a
                      href="https://blog.totofinance.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Our Blog
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                    asChild
                  >
                    <a
                      href="https://exchange.lcx.com/en/trade/TOTO-EUR"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy Toto
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Balance Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-auto px-4 lg:px-0"
            >
              <Card className="bg-muted/10 border-border lg:min-w-[320px]">
                <CardContent className="p-4 space-y-0">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs tracking-wider uppercase text-muted-foreground">Claimed Toto</span>
                    <span className="text-foreground font-sans font-medium text-sm">
                      {isLoadingRewards ? "..." : `${totoRewards.claimed.toLocaleString()} TOTO`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs tracking-wider uppercase text-muted-foreground">Claimable Toto</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="px-3 py-1 h-auto border-gold text-gold rounded-full font-sans font-medium text-xs hover:bg-gold hover:text-charcoal min-w-[90px] transition-all"
                      onMouseEnter={() => setIsClaimHovered(true)}
                      onMouseLeave={() => setIsClaimHovered(false)}
                      onClick={() => setClaimModalOpen(true)}
                      disabled={totoRewards.claimable === 0}
                    >
                      {isClaimHovered && totoRewards.claimable > 0 ? "Claim" : `${totoRewards.claimable.toLocaleString()} TOTO`}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs tracking-wider uppercase text-muted-foreground">Total Toto</span>
                    <span className="text-foreground font-sans font-medium text-sm">
                      {isLoadingRewards ? "..." : `${totoRewards.total.toLocaleString()} TOTO`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container mx-auto px-4 lg:px-8 max-w-[1400px] mt-12 pb-20">
        <Tabs defaultValue="owned" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="w-max sm:w-auto sm:inline-flex justify-start bg-muted/20 border border-border rounded-xl p-1 h-auto flex gap-1 sm:gap-2">
              <TabsTrigger
                value="owned"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Gem className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Owned Assets</span>
                <span className="sm:hidden">Owned</span>
              </TabsTrigger>
              <TabsTrigger
                value="bids"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Gavel className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Your Bids</span>
                <span className="sm:hidden">Bids</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Activity className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="referral"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Users className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Referral
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Heart className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Wishlist
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Owned Assets Tab */}
          <TabsContent value="owned" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">
                {isLoadingAssets ? "Loading..." : `${ownedAssets.length} items`}
              </p>
            </div>
            
            {/* Loading State */}
            {isLoadingAssets && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            )}
            
            {/* Error State */}
            {!isLoadingAssets && assetsError && (
              <div className="text-center py-16">
                <Gem className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Unable to load assets</p>
                <p className="text-muted-foreground text-sm">{assetsError}</p>
              </div>
            )}
            
            {/* No Wallet Connected */}
            {!isLoadingAssets && !assetsError && !walletAddress && (
              <div className="text-center py-16">
                <Gem className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Connect your wallet</p>
                <p className="text-muted-foreground text-sm mb-6">Connect your wallet to view your owned assets.</p>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoadingAssets && !assetsError && walletAddress && ownedAssets.length === 0 && (
              <div className="text-center py-16">
                <Gem className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No assets found</p>
                <p className="text-muted-foreground text-sm mb-6">You don't own any assets yet. Start exploring!</p>
                <Link to="/">
                  <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal">
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Assets Grid */}
            {!isLoadingAssets && !assetsError && ownedAssets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedAssets.map((product, index) => (
                  <AccountProductCard
                    key={product.id || product._id}
                    product={product}
                    index={index}
                    viewMode="grid"
                    variant="owned"
                    onListForSale={() => handleListForSale(product)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Your Bids Tab */}
          <TabsContent value="bids" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">
                {isLoadingBids ? "Loading..." : `${activeBids.length} active bids`}
              </p>
            </div>
            
            {/* Loading State */}
            {isLoadingBids && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            )}
            
            {/* Error State */}
            {!isLoadingBids && bidsError && (
              <div className="text-center py-16">
                <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Unable to load bids</p>
                <p className="text-muted-foreground text-sm">{bidsError}</p>
              </div>
            )}
            
            {/* No Wallet Connected */}
            {!isLoadingBids && !bidsError && !walletAddress && (
              <div className="text-center py-16">
                <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Connect your wallet</p>
                <p className="text-muted-foreground text-sm">Connect your wallet to view your active bids.</p>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoadingBids && !bidsError && walletAddress && activeBids.length === 0 && (
              <div className="text-center py-16">
                <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No active bids</p>
                <p className="text-muted-foreground text-sm mb-6">You don't have any active bids on auctions.</p>
                <Link to="/category/diamonds">
                  <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal">
                    Browse Auctions
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Bids Grid */}
            {!isLoadingBids && !bidsError && activeBids.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeBids.map((product, index) => (
                  <AccountProductCard
                    key={product.id || product._id}
                    product={product}
                    index={index}
                    viewMode="grid"
                    variant="bid"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-8">
            <div className="text-center py-16">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Coming Soon</p>
              <p className="text-muted-foreground text-sm">Your transaction history will be available soon.</p>
            </div>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-8">
            <div className="text-center py-16">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Coming Soon</p>
              <p className="text-muted-foreground text-sm">The referral program will be available soon.</p>
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">{wishlistItems.length} saved items</p>
            </div>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Your wishlist is empty</p>
                <p className="text-muted-foreground text-sm mb-6">Add items to your wishlist by clicking the heart icon on any product.</p>
                <Link to="/">
                  <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal">
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product, index) => (
                  <AccountProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    viewMode="grid"
                    variant="wishlist"
                    onRemove={() => handleRemoveFromWishlist(product.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />

      {/* Listing Modal */}
      <ListingModal
        open={listingModalOpen}
        onOpenChange={setListingModalOpen}
        productName={selectedProduct?.name}
        onListingComplete={handleListingComplete}
      />

      {/* Claim Toto Modal */}
      <ClaimTotoModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        claimableAmount={totoRewards.claimable}
        onClaimComplete={() => {
          toast({
            title: "Rewards claimed",
            description: `${totoRewards.claimable.toLocaleString()} TOTO has been credited to your wallet.`,
          });
        }}
      />
    </div>
  );
};

export default Account;
