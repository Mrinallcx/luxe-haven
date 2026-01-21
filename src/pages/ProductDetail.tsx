import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { allProducts, Product } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2, Gavel, ShoppingBag, Link2, Check, Loader2, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import PlaceBidModal from "@/components/PlaceBidModal";
import ProductName from "@/components/ProductName";
import { getMarketDetails, normalizeMarketDetails, getProductActivity, ActivityItem, getTiamondDetails, TiamondDetails } from "@/lib/market-api";
import { ProductTabs, TransactionHistory, RelatedProducts } from "@/components/product";
import { getCategoryInfoBox, getInitialOffers, truncateAddress, getEtherscanAddressUrl, normalizeImageUrl } from "@/utils/product-helpers";
import SEO from "@/components/shared/SEO";

// Extended product type that supports both static and API products
type ExtendedProduct = Product & { 
  _id?: string;
  owner?: string;
  chain?: string;
  wishlistCount?: number;
  viewCount?: number;
  saleType?: string;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [tiamondDetails, setTiamondDetails] = useState<TiamondDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ActivityItem[]>([]);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [offers] = useState(getInitialOffers);
  const [linkCopied, setLinkCopied] = useState(false);
  const { addToCart, isInCart, hasItemInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Fetch product details and transaction history from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // First check if product was passed via navigation state
      const stateProduct = location.state?.product as ExtendedProduct | undefined;
      
      // Try to fetch from API using tokenId
      const response = await getMarketDetails(productId);
      
      if (response.data?.result) {
        const normalizedProduct = normalizeMarketDetails(response.data.result);
        setProduct(normalizedProduct as ExtendedProduct);
        
        const tokenIdNum = Number(productId);
        if (!isNaN(tokenIdNum)) {
          // Fetch tiamond details (for product overview)
          const tiamondResponse = await getTiamondDetails(tokenIdNum);
          if (tiamondResponse.data?.result) {
            setTiamondDetails(tiamondResponse.data.result);
          }
          
          // Fetch transaction history
          const activityResponse = await getProductActivity(tokenIdNum);
          if (activityResponse.data?.result) {
            setTransactions(activityResponse.data.result);
          }
        }
        
        setIsLoading(false);
        return;
      }

      // If API fails, try state product
      if (stateProduct && (stateProduct._id === productId || String(stateProduct.id) === productId)) {
        setProduct(stateProduct);
        
        // Try to fetch transaction history with state product's id
        const tokenIdNum = Number(stateProduct.id);
        if (!isNaN(tokenIdNum)) {
          const activityResponse = await getProductActivity(tokenIdNum);
          if (activityResponse.data?.result) {
            setTransactions(activityResponse.data.result);
          }
        }
        
        setIsLoading(false);
        return;
      }

      // Fall back to static data
      const staticProduct = allProducts.find((p) => p.id === Number(productId) || String(p.id) === productId);
      if (staticProduct) {
        setProduct(staticProduct);
        setIsLoading(false);
        return;
      }

      // No product found
      setError("Product not found");
      setIsLoading(false);
    };

    fetchProduct();
  }, [productId, location.state]);

  const currentUrl = window.location.href;
  const shareText = product ? `Check out ${product.name} on Toto Finance` : "Check out this product on Toto Finance";

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
  
  // Get related products from same category (excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-serif font-light text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
  const categoryInfo = getCategoryInfoBox(product.category);

  // Generate product description for SEO
  const productDescription = `${product.name} - Premium ${categoryLabel} available at Toto Finance. ${product.purity} purity, ${product.weight} weight. Price: $${product.price.toLocaleString()}. Certified quality with authenticity guarantee.`;

  // Get normalized image URL for OG tags (handles S3 URLs with URL-encoded characters like + and %23)
  const ogImageUrl = normalizeImageUrl(product.image);
  
  // Debug: Log OG tags in development and verify image URL
  if (process.env.NODE_ENV === "development") {
    if (ogImageUrl) {
      console.log("📸 OG Tags for product:", {
        title: product.name,
        description: productDescription.substring(0, 100) + "...",
        image: ogImageUrl,
        url: currentUrl,
      });
      
      // Verify the image URL format
      if (!ogImageUrl.startsWith("http")) {
        console.warn("⚠️ OG Image URL is not absolute:", ogImageUrl);
      } else {
        console.log("✅ OG Image URL is absolute and should work for social sharing");
      }
    } else {
      console.warn("⚠️ No OG Image URL available for product:", product.name);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.name}
        description={productDescription}
        image={ogImageUrl}
        url={currentUrl}
        type="product"
      />
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
            <ProductTabs 
              tiamondDetails={tiamondDetails}
              categoryLabel={categoryLabel}
              offers={offers}
              productPrice={product.price}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Title Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground">
                <ProductName name={product.name} />
              </h1>
              {tiamondDetails?.market?.owner && (
                <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Owned By</p>
                  <a 
                    href={getEtherscanAddressUrl(tiamondDetails.market.owner)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold font-mono text-sm hover:underline flex items-center justify-end gap-1"
                  >
                    {truncateAddress(tiamondDetails.market.owner)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
              </div>
              )}
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    isInWishlist(product.id) 
                      ? "bg-gold/10 border-gold text-gold" 
                      : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-gold" : ""}`} />
                  <span className="text-xs font-medium">
                    {isInWishlist(product.id) ? "Saved" : "Save"}
                  </span>
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
              <h3 className="font-serif font-light text-foreground mb-2">{categoryInfo.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {categoryInfo.description}
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
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
                {(product.saleType === "NOSALE" || product.isSoldOut) ? "Last Sale Price" : "Our Price"}
              </p>
              <p className="text-3xl font-semibold text-foreground mb-4">
                ${product.price.toLocaleString()}
              </p>
              {(product.saleType === "NOSALE" || product.isSoldOut) ? (
                <Button 
                  disabled
                  className="w-full rounded-lg bg-charcoal/80 text-cream font-medium py-6 text-base gap-2 cursor-not-allowed"
                >
                  <Check className="w-5 h-5" />
                  SOLD
                </Button>
              ) : isInCart(product.id) ? (
                <Button 
                  disabled
                  className="w-full rounded-lg bg-gold hover:bg-gold/90 text-charcoal font-medium py-6 text-base gap-2 cursor-not-allowed opacity-100"
                >
                  <Check className="w-5 h-5" />
                  IN CART
                </Button>
              ) : hasItemInCart() ? (
                <Button 
                  onClick={() => {
                    const success = addToCart(product);
                    if (success) {
                      toast({
                        title: "Added to cart",
                        description: `${product.name} has been added to your cart.`,
                      });
                    }
                  }}
                  className="w-full rounded-lg bg-muted text-muted-foreground font-medium py-6 text-base gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  CART FULL
                </Button>
              ) : (
              <Button 
                onClick={() => {
                  if (product.status === "auction") {
                    setIsBidModalOpen(true);
                    return;
                  }
                    const success = addToCart(product);
                    if (success) {
                  toast({
                    title: "Added to cart",
                    description: `${product.name} has been added to your cart.`,
                  });
                    }
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
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={relatedProducts}
          categoryLabel={categoryLabel}
          currentCategory={product.category}
        />

        {/* Transaction History */}
        <TransactionHistory transactions={transactions} />

        {/* Back to Category */}
        <div className="mt-12 text-center">
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
        productName={product?.name || ""}
        minimumBid={product ? Math.floor(product.price / 10) : 0}
        increment={1000}
        currency="LCX"
      />
    </div>
  );
};

export default ProductDetail;
