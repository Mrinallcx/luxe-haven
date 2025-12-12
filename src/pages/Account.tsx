import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Camera, Diamond, Coins, Gift, TrendingUp, Gavel, Activity, Users, Heart, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { allProducts } from "@/data/products";
import { Link } from "react-router-dom";

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
const ownedDiamonds = allProducts.filter(p => p.category === "Diamonds").slice(0, 6);

// Mock bids data
const bidsData = [
  { id: 1, product: "1.5 Carat Round Diamond", bidAmount: 4500, currentBid: 4800, status: "Outbid", date: "12 Dec 2024" },
  { id: 2, product: "2.0 Carat Princess Cut", bidAmount: 8200, currentBid: 8200, status: "Winning", date: "11 Dec 2024" },
  { id: 3, product: "0.75 Carat Oval Diamond", bidAmount: 2100, currentBid: 2500, status: "Outbid", date: "10 Dec 2024" },
];

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

// Mock wishlist
const wishlistItems = allProducts.slice(5, 9);

const Account = () => {
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner & Profile Section */}
      <section className="relative pt-20">
        {/* Banner */}
        <div className="h-48 md:h-64 relative overflow-hidden">
          <img
            src={userData.banner}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Button
            size="sm"
            variant="outline"
            className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur-sm border-border/50"
          >
            <Camera className="w-4 h-4 mr-2" />
            Edit Banner
          </Button>
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
          <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-gold/20 text-gold text-3xl font-serif">
                  {userData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-2 right-2 rounded-full w-8 h-8 bg-background/80 backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center md:text-left pb-4">
              <h1 className="text-2xl md:text-3xl font-serif text-foreground">{userData.name}</h1>
              <p className="text-muted-foreground">{userData.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since {userData.memberSince}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Balance Section */}
      <section className="container mx-auto px-4 lg:px-8 max-w-[1400px] mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <Card className="bg-muted/10 border-border overflow-hidden">
            <CardContent className="p-6 space-y-0">
              {/* Owned Diamonds */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm tracking-wider uppercase text-muted-foreground font-medium">
                  Owned Diamonds
                </span>
                <span className="px-4 py-1.5 bg-muted/30 border border-border rounded-full text-foreground font-serif text-sm">
                  {balanceData.ownedDiamonds} DIAMOND
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Claimed Toto */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm tracking-wider uppercase text-muted-foreground font-medium">
                  Claimed Toto
                </span>
                <span className="text-muted-foreground font-serif">
                  {balanceData.claimedToto.toLocaleString()} TOTO
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Claimable Toto */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm tracking-wider uppercase text-muted-foreground font-medium">
                  Claimable Toto
                </span>
                <span className="px-4 py-1.5 border border-gold text-gold rounded-full font-serif text-sm">
                  {balanceData.claimableToto.toLocaleString()} TOTO
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Total Toto */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm tracking-wider uppercase text-muted-foreground font-medium">
                  Total Toto
                </span>
                <span className="text-muted-foreground font-serif">
                  {balanceData.totalToto.toLocaleString()} TOTO
                </span>
              </div>

              {/* Claim Button */}
              {balanceData.claimableToto > 0 && (
                <Button className="w-full mt-4 rounded-full border-2 border-gold bg-transparent text-gold hover:bg-gold hover:text-charcoal transition-all tracking-wider uppercase">
                  Claim Toto
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Tabs Section */}
      <section className="container mx-auto px-4 lg:px-8 max-w-[1400px] mt-12 pb-20">
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="w-full justify-start bg-muted/20 border border-border rounded-lg p-1 h-auto flex-wrap">
            <TabsTrigger
              value="owned"
              className="rounded-md data-[state=active]:bg-gold data-[state=active]:text-charcoal px-4 py-2"
            >
              <Diamond className="w-4 h-4 mr-2" />
              Owned Diamonds
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              className="rounded-md data-[state=active]:bg-gold data-[state=active]:text-charcoal px-4 py-2"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Your Bids
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-md data-[state=active]:bg-gold data-[state=active]:text-charcoal px-4 py-2"
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="referral"
              className="rounded-md data-[state=active]:bg-gold data-[state=active]:text-charcoal px-4 py-2"
            >
              <Users className="w-4 h-4 mr-2" />
              Referral
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="rounded-md data-[state=active]:bg-gold data-[state=active]:text-charcoal px-4 py-2"
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </TabsTrigger>
          </TabsList>

          {/* Owned Diamonds Tab */}
          <TabsContent value="owned" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedDiamonds.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <Card className="overflow-hidden bg-muted/20 border-border hover:border-gold/50 transition-all">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif text-foreground group-hover:text-gold transition-colors">{product.name}</h3>
                        <p className="text-gold font-medium mt-1">${product.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Your Bids Tab */}
          <TabsContent value="bids" className="mt-8">
            <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Product</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Your Bid</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Current Bid</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidsData.map((bid) => (
                    <TableRow key={bid.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{bid.product}</TableCell>
                      <TableCell className="text-foreground">${bid.bidAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">${bid.currentBid.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          bid.status === "Winning" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {bid.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{bid.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <Card className="overflow-hidden bg-muted/20 border-border hover:border-gold/50 transition-all">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif text-foreground group-hover:text-gold transition-colors">{product.name}</h3>
                        <p className="text-gold font-medium mt-1">${product.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default Account;
