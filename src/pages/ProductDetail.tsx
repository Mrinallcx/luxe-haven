import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { allProducts } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Heart, Share2, FileText, Shield, Info, Gavel, Tag, ShoppingBag, HandCoins, Link2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import AcceptOfferModal from "@/components/AcceptOfferModal";
import CounterOfferModal from "@/components/CounterOfferModal";
import ViewOfferModal from "@/components/ViewOfferModal";
import ProductName from "@/components/ProductName";

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
  const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
  const [counterOffer, setCounterOffer] = useState<typeof offers[0] | null>(null);
  const [viewOffer, setViewOffer] = useState<typeof offers[0] | null>(null);
  const [, setTick] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const currentUrl = window.location.href;
  const shareText = product ? `Check out ${product.name} on MAISON` : "Check out this product on MAISON";

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setLinkCopied(true);
    toast({
      title: "Link copied",
      description: "Product link has been copied to clipboard.",
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

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
                    <div key={offer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background/50 rounded-lg border border-border gap-4">
                      <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Bid Amount</p>
                          <p className="text-foreground font-medium text-sm sm:text-base">€{Math.floor(product.price * offer.priceMultiplier).toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-border" />
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Token</p>
                          <p className="text-foreground font-medium text-sm sm:text-base">{offer.token}</p>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-border" />
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Expires</p>
                          <p className="text-foreground font-medium font-mono text-xs sm:text-sm">{formatTimeRemaining(offer.expiresAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                        <Button 
                          size="sm" 
                          className="rounded-full bg-gold hover:bg-gold/90 text-charcoal text-xs flex-1 sm:flex-none"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full text-xs flex-1 sm:flex-none"
                          onClick={() => setCounterOffer(offer)}
                        >
                          Counter
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full text-xs flex-1 sm:flex-none"
                          onClick={() => setViewOffer(offer)}
                        >
                          View Offer
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
                <ProductName name={product.name} />
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
                    <DropdownMenuItem onClick={handleShareTwitter} className="cursor-pointer gap-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X (Twitter)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareLinkedIn} className="cursor-pointer gap-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-3">
                      {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                  {relatedProducts.map((relatedProduct, index) => (
                    <CarouselItem key={relatedProduct.id} className="pl-2 basis-[85%]">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Link to={`/product/${relatedProduct.id}`} className="group block">
                          <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg">
                            <div className="relative aspect-square overflow-hidden bg-secondary">
                              <img
                                src={relatedProduct.image}
                                alt={relatedProduct.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-4 left-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
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
                                </span>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                                <ProductName name={relatedProduct.name} />
                              </h3>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-semibold text-foreground">
                                  €{relatedProduct.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {relatedProduct.status === "auction" ? "current bid" : relatedProduct.pricePerUnit}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-background/80 border-border" />
                <CarouselNext className="right-2 bg-background/80 border-border" />
              </Carousel>
            </div>

            {/* Tablet Carousel */}
            <div className="hidden md:block lg:hidden">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {relatedProducts.map((relatedProduct, index) => (
                    <CarouselItem key={relatedProduct.id} className="pl-4 basis-1/3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Link to={`/product/${relatedProduct.id}`} className="group block">
                          <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg">
                            <div className="relative aspect-square overflow-hidden bg-secondary">
                              <img
                                src={relatedProduct.image}
                                alt={relatedProduct.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-4 left-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
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
                                </span>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                                <ProductName name={relatedProduct.name} />
                              </h3>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-semibold text-foreground">
                                  €{relatedProduct.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {relatedProduct.status === "auction" ? "current bid" : relatedProduct.pricePerUnit}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-background/80 border-border" />
                <CarouselNext className="right-2 bg-background/80 border-border" />
              </Carousel>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/product/${relatedProduct.id}`} className="group block">
                    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-secondary">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
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
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              if (relatedProduct.status === "auction") {
                                return;
                              }
                              addToCart(relatedProduct);
                              toast({
                                title: "Added to cart",
                                description: `${relatedProduct.name} has been added to your cart.`,
                              });
                            }}
                            className="w-full bg-charcoal hover:bg-charcoal/90 text-cream rounded-lg gap-2"
                          >
                            {relatedProduct.status === "auction" ? (
                              <>
                                <Gavel className="w-4 h-4" />
                                Place Bid
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-medium text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                          <ProductName name={relatedProduct.name} />
                        </h3>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-semibold text-foreground">
                            €{relatedProduct.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {relatedProduct.status === "auction" ? "current bid" : relatedProduct.pricePerUnit}
                          </span>
                        </div>
                      </div>
                    </div>
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

      {/* Accept Offer Modal */}
      <AcceptOfferModal
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
        price={selectedOffer ? Math.floor(product.price * selectedOffer.priceMultiplier) : 0}
        token={selectedOffer?.token || "LCX"}
        expiresAt={selectedOffer?.expiresAt || Date.now()}
      />

      {/* Counter Offer Modal */}
      <CounterOfferModal
        open={!!counterOffer}
        onOpenChange={(open) => !open && setCounterOffer(null)}
        originalPrice={counterOffer ? Math.floor(product.price * counterOffer.priceMultiplier) : 0}
        token={counterOffer?.token || "LCX"}
        expiresAt={counterOffer?.expiresAt || Date.now()}
      />

      {/* View Offer Modal */}
      <ViewOfferModal
        open={!!viewOffer}
        onOpenChange={(open) => !open && setViewOffer(null)}
        originalPrice={viewOffer ? Math.floor(product.price * viewOffer.priceMultiplier) : 0}
        counteredPrice={viewOffer ? Math.floor(product.price * viewOffer.priceMultiplier * 1.2) : 0}
        token={viewOffer?.token || "LCX"}
        expiresAt={viewOffer?.expiresAt || Date.now()}
      />
    </div>
  );
};

export default ProductDetail;
