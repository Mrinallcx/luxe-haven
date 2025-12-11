import { useParams, Link } from "react-router-dom";
import { allProducts } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingBag, Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";
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
      
      <main className="container mx-auto px-4 lg:px-8 pt-24 pb-8">
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
            <Badge variant="secondary" className="w-fit mb-4">
              {categoryLabel}
            </Badge>
            
            <h1 className="text-3xl lg:text-4xl font-serif text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-semibold text-foreground">
                €{product.price.toLocaleString()}
              </span>
              <span className="text-muted-foreground">{product.pricePerUnit}</span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purity</p>
                <p className="font-medium text-foreground">{product.purity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Weight</p>
                <p className="font-medium text-foreground">{product.weight}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="flex-1 rounded-full bg-gold hover:bg-gold/90 text-charcoal font-medium">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="rounded-full">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-gold" />
                <span className="text-muted-foreground">Certified Authentic & Ethically Sourced</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-muted-foreground">Free Insured Shipping on Orders Over €5,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-gold" />
                <span className="text-muted-foreground">14-Day Return Policy</span>
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
