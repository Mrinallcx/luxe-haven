import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Diamond, Gavel, Activity, Users, Heart, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { allProducts, Product } from "@/data/products";
import { Link } from "react-router-dom";
import AccountProductCard from "@/components/AccountProductCard";
import ViewToggle from "@/components/ViewToggle";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import ListingModal from "@/components/ListingModal";
import ClaimTotoModal from "@/components/ClaimTotoModal";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  memberSince: "Jan 2024",
  avatar: "",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop",
};

// Mock balance data
const balanceData = {
  ownedDiamonds: 12,
  claimedToto: 2500,
  claimableToto: 750,
  totalToto: 3250,
};

// Mock owned diamonds
const ownedDiamonds = allProducts.filter(p => p.category === "diamonds").slice(0, 6);

// Mock bids data with product references
const bidsProducts = allProducts.filter(p => p.category === "diamonds").slice(10, 16);
const bidsData = bidsProducts.map((product, i) => ({
  product,
  bidAmount: product.price - Math.floor(Math.random() * 500),
  currentBid: product.price,
  status: i % 2 === 0 ? "Outbid" : "Winning",
  date: `${12 - i} Dec 2024`,
}));

// Mock activity data
const activityData = [
  { id: 1, action: "Purchased", item: "1.2 Carat Emerald Cut", date: "12 Dec 2024", amount: "$5,200" },
  { id: 2, action: "Bid Placed", item: "2.0 Carat Princess Cut", date: "11 Dec 2024", amount: "$8,200" },
  { id: 3, action: "Claimed Toto", item: "Daily Reward", date: "10 Dec 2024", amount: "250 TOTO" },
  { id: 4, action: "Referred", item: "Jane Smith", date: "09 Dec 2024", amount: "100 TOTO" },
  { id: 5, action: "Purchased", item: "Gold Bar 100g", date: "08 Dec 2024", amount: "$6,800" },
];

// Mock referral data
const referralData = {
  code: "JOHN2024",
  totalReferrals: 8,
  pendingRewards: 200,
  earnedRewards: 800,
  referrals: [
    { id: 1, name: "Jane Smith", date: "09 Dec 2024", status: "Completed", reward: 100 },
    { id: 2, name: "Mike Johnson", date: "05 Dec 2024", status: "Completed", reward: 100 },
    { id: 3, name: "Sarah Wilson", date: "01 Dec 2024", status: "Pending", reward: 100 },
  ],
};

const Account = () => {
  const [copied, setCopied] = useState(false);
  // Wishlist uses grid view only
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [isClaimHovered, setIsClaimHovered] = useState(false);

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
    navigator.clipboard.writeText(referralData.code);
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
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="bg-gold/20 text-gold text-xl font-serif">
                      {userData.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Name + Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4">
                <h1 className="text-xl font-serif text-foreground">
                  {userData.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Visit Store
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Marketplace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Auction Live
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-xs tracking-wider uppercase hover:border-gold hover:text-gold"
                  >
                    Buy Toto
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
                    <span className="text-foreground font-sans font-medium text-sm">{balanceData.claimedToto.toLocaleString()} TOTO</span>
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
                    >
                      {isClaimHovered ? "Claim" : `${balanceData.claimableToto.toLocaleString()} TOTO`}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs tracking-wider uppercase text-muted-foreground">Total Toto</span>
                    <span className="text-foreground font-sans font-medium text-sm">{balanceData.totalToto.toLocaleString()} TOTO</span>
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
            <TabsList className="w-max sm:w-auto sm:inline-flex justify-start bg-muted/20 border border-border rounded-xl p-1.5 h-auto flex gap-1 sm:gap-2">
              <TabsTrigger
                value="owned"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Diamond className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Owned Diamonds</span>
                <span className="sm:hidden">Owned</span>
              </TabsTrigger>
              <TabsTrigger
                value="bids"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Gavel className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Your Bids</span>
                <span className="sm:hidden">Bids</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Activity className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="referral"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Users className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Referral
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="rounded-lg data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-md px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover:bg-muted/50"
              >
                <Heart className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                Wishlist
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Owned Diamonds Tab */}
          <TabsContent value="owned" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">{ownedDiamonds.length} items</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedDiamonds.map((product, index) => (
                <AccountProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  viewMode="grid"
                  variant="owned"
                  onListForSale={() => handleListForSale(product)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Your Bids Tab */}
          <TabsContent value="bids" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">{bidsData.length} active bids</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bidsData.map((bid, index) => (
                <AccountProductCard
                  key={bid.product.id}
                  product={bid.product}
                  index={index}
                  viewMode="grid"
                  variant="bid"
                  bidData={{
                    bidAmount: bid.bidAmount,
                    currentBid: bid.currentBid,
                    status: bid.status,
                    date: bid.date,
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-8">
            <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Action</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Item</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityData.map((activity) => (
                    <TableRow key={activity.id} className="border-border">
                      <TableCell>
                        <span className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full">
                          {activity.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">{activity.item}</TableCell>
                      <TableCell className="text-foreground font-medium">{activity.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xl font-mono text-gold bg-gold/10 px-3 py-1 rounded-lg">
                      {referralData.code}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={copyReferralCode}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Referrals</p>
                  <p className="text-2xl font-serif text-foreground">{referralData.totalReferrals}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Earned</p>
                  <p className="text-2xl font-serif text-gold">{referralData.earnedRewards} TOTO</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Referred User</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData.referrals.map((ref) => (
                    <TableRow key={ref.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{ref.name}</TableCell>
                      <TableCell className="text-muted-foreground">{ref.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ref.status === "Completed" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {ref.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gold font-medium">{ref.reward} TOTO</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        claimableAmount={balanceData.claimableToto}
        onClaimComplete={() => {
          toast({
            title: "Rewards claimed",
            description: `${balanceData.claimableToto.toLocaleString()} TOTO has been credited to your wallet.`,
          });
        }}
      />
    </div>
  );
};

export default Account;
