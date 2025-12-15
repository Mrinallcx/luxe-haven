import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { allProducts } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Heart, Share2, FileText, Shield, Info, Gavel, Tag, ShoppingBag, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";

// Mock transaction data
const generateTransactions = (count: number) => {
  const saleTypes = ["Primary Sale", "Secondary Sale", "Transfer", "Auction"];
  const transactions = [];
  for (let i = 1; i <= count; i++) {
    transactions.push({
      id: i,
      saleType: saleTypes[Math.floor(Math.random() * saleTypes.length)],
      from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    });
  }
  return transactions;
};

const allTransactions = generateTransactions(30);

// Mock offers with expiration times
const getInitialOffers = () => [
  { id: 1, priceMultiplier: 0.85, token: "LCX", expiresAt: Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) },
  { id: 2, priceMultiplier: 0.78, token: "USDT", expiresAt: Date.now() + (5 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) },
  { id: 3, priceMultiplier: 0.72, token: "wETH", expiresAt: Date.now() + (12 * 60 * 60 * 1000) + (30 * 60 * 1000) },
];

const formatTimeRemaining = (expiresAt: number) => {
  const now = Date.now();
  const diff = expiresAt - now;
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const product = allProducts.find((p) => p.id === Number(productId));
  const [visibleTransactions, setVisibleTransactions] = useState(10);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [offers] = useState(getInitialOffers);
  const [, setTick] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Get related products from same category (excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const displayedTransactions = allTransactions.slice(0, visibleTransactions);
  const hasMore = visibleTransactions < allTransactions.length;
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Product Not Found</h1>
          <Link to="/">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-cream rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-muted/20 rounded-lg p-1">
                <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2 text-xs sm:text-sm">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
                <TabsTrigger value="insurance" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Insurance</span>
                </TabsTrigger>
                <TabsTrigger value="offers" className="flex items-center gap-2 text-xs sm:text-sm">
                  <HandCoins className="w-4 h-4" />
                  <span className="hidden sm:inline">Offers</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
                <h3 className="font-serif text-foreground mb-3">Product Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  This exquisite {categoryLabel.toLowerCase()} piece represents the pinnacle of quality and craftsmanship. 
                  Each asset is carefully selected and verified to meet our stringent standards.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="text-foreground font-medium">{categoryLabel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Purity</p>
                    <p className="text-foreground font-medium">{product.purity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="text-foreground font-medium">{product.weight}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="text-foreground font-medium">Available</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
                <h3 className="font-serif text-foreground mb-3">Certificates & Documents</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  All documents are available for download after purchase and stored securely in your account.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gold" />
                      <span className="text-sm text-foreground">Certificate of Authenticity</span>
                    </div>
                    <span className="text-xs text-muted-foreground">PDF</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gold" />
                      <span className="text-sm text-foreground">Quality Assessment Report</span>
                    </div>
                    <span className="text-xs text-muted-foreground">PDF</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gold" />
                      <span className="text-sm text-foreground">Provenance Documentation</span>
                    </div>
                    <span className="text-xs text-muted-foreground">PDF</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
                <h3 className="font-serif text-foreground mb-3">Insurance Coverage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Your asset is fully insured from the moment of purchase, at no additional cost.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Full Value Coverage</p>
                      <p className="text-xs text-muted-foreground">100% coverage against theft, loss, or damage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Secure Storage</p>
                      <p className="text-xs text-muted-foreground">Assets stored in high-security vaults</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">No Deductible</p>
                      <p className="text-xs text-muted-foreground">Full replacement with no out-of-pocket costs</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="offers" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
                <h3 className="font-serif text-foreground mb-3">Current Offers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Review and respond to bid offers from potential buyers.
                </p>
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bid Amount</p>
                          <p className="text-foreground font-medium">€{Math.floor(product.price * offer.priceMultiplier).toLocaleString()}</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                          <p className="text-sm text-muted-foreground">Token</p>
                          <p className="text-foreground font-medium">{offer.token}</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expires</p>
                          <p className="text-foreground font-medium font-mono text-sm">{formatTimeRemaining(offer.expiresAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="rounded-full bg-gold hover:bg-gold/90 text-charcoal text-xs">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full text-xs">
                          Counter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Title Row */}
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl lg:text-4xl font-serif text-foreground">
                {product.name}
              </h1>
              <div className="text-right">
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Owned By</p>
                <p className="text-gold font-serif text-lg">MAISON</p>
              </div>
            </div>

            {/* Specs Row */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gold text-sm tracking-wide">
                {product.purity} | {product.weight} | Premium
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                      toast({
                        title: "Removed from wishlist",
                        description: `${product.name} has been removed from your wishlist.`,
                      });
                    } else {
                      addToWishlist(product);
                      toast({
                        title: "Added to wishlist",
                        description: `${product.name} has been added to your wishlist.`,
                      });
                    }
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-gold text-gold" : ""}`} />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-muted/20 border border-border rounded-lg p-5 mb-6">
              <h3 className="font-serif text-foreground mb-2">Certified Precious Asset</h3>
              <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-wide">
                Own certified {categoryLabel.toLowerCase()} stored securely with free insurance. Trade, gift, or redeem your asset anytime - with full transparency and traceability.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="bg-muted/20 border border-border rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Trusted by 1000+ People</p>
              <div className="flex items-center gap-6">
                <span className="text-sm text-foreground">Conflict Free</span>
                <span className="text-sm text-foreground">Free Insured</span>
                <span className="text-sm text-foreground">Certified</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-muted/20 border border-border rounded-lg p-6 mb-6">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Our Price</p>
              <p className="text-3xl font-semibold text-foreground mb-4">
                €{product.price.toLocaleString()}
              </p>
              <Button 
                onClick={() => {
                  if (product.status === "auction") {
                    setIsBidModalOpen(true);
                    return;
                  }
                  addToCart(product);
                  toast({
                    title: "Added to cart",
                    description: `${product.name} has been added to your cart.`,
                  });
                }}
                className="w-full rounded-lg bg-gold hover:bg-gold/90 text-charcoal font-medium py-6 text-base gap-2"
              >
                {product.status === "auction" ? (
                  <>
                    <Gavel className="w-5 h-5" />
                    PLACE BID
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    ADD TO CART
                  </>
                )}
              </Button>
            </div>

            {/* Price Comparison */}
            <div>
              <h4 className="font-serif text-foreground mb-3">Price Comparison</h4>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  LIVE
                </span>
                <span className="text-sm text-muted-foreground bg-charcoal/30 px-3 py-1 rounded">
                  Competitor A - €{(product.price * 1.15).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground bg-charcoal/30 px-3 py-1 rounded">
                  Competitor B - €{(product.price * 1.2).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-foreground">Related Products</h2>
              <Link 
                to={`/category/${product.category}`}
                className="text-sm text-gold hover:text-gold/80 transition-colors"
              >
                View All {categoryLabel}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/product/${relatedProduct.id}`} className="group block">
                    <div className="relative aspect-square bg-cream rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Status Badge */}
                      {relatedProduct.status && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          relatedProduct.status === "auction" 
                            ? "bg-gold/90 text-charcoal" 
                            : "bg-charcoal/90 text-cream"
                        }`}>
                          {relatedProduct.status === "auction" ? (
                            <>
                              <Gavel className="w-3 h-3" />
                              Auction
                            </>
                          ) : (
                            <>
                              <Tag className="w-3 h-3" />
                              On Sale
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-foreground text-sm mb-1 group-hover:text-gold transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gold text-sm font-medium">
                      €{relatedProduct.price.toLocaleString()}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Transaction History Table */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif text-foreground mb-8">Transaction History</h2>
          <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Sl No</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Sale Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium">From</TableHead>
                  <TableHead className="text-muted-foreground font-medium">To</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-border">
                    <TableCell className="text-foreground">{tx.id}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full">
                        {tx.saleType}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{tx.from}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{tx.to}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="rounded-full border-gold text-gold hover:bg-gold hover:text-charcoal"
                onClick={() => setVisibleTransactions((prev) => prev + 10)}
              >
                View More
              </Button>
            </div>
          )}
        </section>

        {/* Back Link */}
        <div className="mt-12">
          <Link to={`/category/${product.category}`}>
            <Button variant="ghost" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {categoryLabel}
            </Button>
          </Link>
        </div>
      </main>

      <Footer />

      {/* Bid Modal */}
      <PlaceBidModal
        open={isBidModalOpen}
        onOpenChange={setIsBidModalOpen}
        productName={product.name}
        minimumBid={Math.floor(product.price / 10)}
        increment={1000}
        currency="LCX"
      />
    </div>
  );
};

export default ProductDetail;
