import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Gem, BadgeCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const steps = [
    { icon: CheckCircle, label: "Order Confirmed", completed: true },
    { icon: Package, label: "Processing", completed: false },
    { icon: Gem, label: "Minting", completed: false },
    { icon: BadgeCheck, label: "Minted", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-[1400px]">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. We've sent a confirmation email with your order details.
          </p>

          {/* Order Details Card */}
          <Card className="bg-muted/20 border-border mb-8 text-left">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="text-lg font-medium text-foreground">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="text-lg font-medium text-foreground">{estimatedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Progress */}
          <Card className="bg-muted/20 border-border mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-serif font-light text-foreground mb-6 text-left">Order Progress</h2>
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                <div className="absolute top-5 left-0 h-0.5 bg-green-500" style={{ width: '12.5%' }} />
                
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? "bg-green-500 text-white" 
                          : "bg-muted border-2 border-border text-muted-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs mt-2 ${
                        step.completed ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/account">
              <Button variant="outline" className="rounded-full w-full sm:w-auto">
                View Order History
              </Button>
            </Link>
            <Link to="/">
              <Button className="rounded-full bg-gold hover:bg-gold/90 text-charcoal w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
