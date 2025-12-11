import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Product = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = allProducts.find((p) => p.id === Number(productId));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-charcoal mb-4">Product Not Found</h1>
            <Link to="/" className="text-gold hover:underline">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/category/${product.category}`} className="capitalize">
                    {product.category}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Details */}
        <section className="container mx-auto px-4 lg:px-8 max-w-[1400px] py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-white rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-gold text-gold" : "text-charcoal"
                  }`}
                />
              </button>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-gold font-sans text-sm uppercase tracking-wider mb-2">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-serif text-3xl text-charcoal">
                  {formatPrice(product.price)}
                </span>
                <span className="text-charcoal/60 font-sans text-sm">
                  {product.pricePerUnit}
                </span>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white rounded-lg">
                <div>
                  <span className="text-charcoal/60 font-sans text-sm">Purity</span>
                  <p className="font-sans font-medium text-charcoal">{product.purity}</p>
                </div>
                <div>
                  <span className="text-charcoal/60 font-sans text-sm">Weight</span>
                  <p className="font-sans font-medium text-charcoal">{product.weight}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-charcoal font-sans text-sm mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-charcoal/20 rounded-full flex items-center justify-center hover:bg-charcoal/5 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-sans text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-charcoal/20 rounded-full flex items-center justify-center hover:bg-charcoal/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button variant="premium" className="flex-1 rounded-full py-6">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1 rounded-full py-6">
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-charcoal/10">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-6 w-6 text-gold mb-2" />
                  <span className="font-sans text-xs text-charcoal/70">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-6 w-6 text-gold mb-2" />
                  <span className="font-sans text-xs text-charcoal/70">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="h-6 w-6 text-gold mb-2" />
                  <span className="font-sans text-xs text-charcoal/70">Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 lg:px-8 max-w-[1400px] py-16">
            <h2 className="font-serif text-2xl text-charcoal mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-sans text-sm text-charcoal group-hover:text-gold transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="font-serif text-charcoal">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Product;
