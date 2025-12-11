import { useParams, Link } from "react-router-dom";
import { allProducts } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = allProducts.find((p) => p.id === Number(productId));

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
          >
            <div className="aspect-square bg-cream rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
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
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">64</span>
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-charcoal/50 border border-border rounded-lg p-5 mb-6">
              <h3 className="font-serif text-foreground mb-2">Certified Precious Asset</h3>
              <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-wide">
                Own certified {categoryLabel.toLowerCase()} stored securely with free insurance. Trade, gift, or redeem your asset anytime - with full transparency and traceability.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="bg-charcoal/30 border border-border rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Trusted by 1000+ People</p>
              <div className="flex items-center gap-6">
                <span className="text-sm text-foreground">Conflict Free</span>
                <span className="text-sm text-foreground">Free Insured</span>
                <span className="text-sm text-foreground">Certified</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-charcoal/50 border border-border rounded-lg p-6 mb-6">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Our Price</p>
              <p className="text-3xl font-semibold text-foreground mb-4">
                €{product.price.toLocaleString()}
              </p>
              <Button className="w-full rounded-lg bg-gold hover:bg-gold/90 text-charcoal font-medium py-6 text-base">
                BUY NOW
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
    </div>
  );
};

export default ProductDetail;
