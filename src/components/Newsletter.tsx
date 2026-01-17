import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to Toto Finance",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-champagne text-sm tracking-[0.3em] uppercase mb-4">
            Stay Connected
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream font-light mb-6">
            The Future of Tokenization
          </h2>
          <p className="text-cream/70 mb-10">
            Get early access to newly acquired assets, upcoming auctions, market insights, and important platform updates.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-cream/30 text-cream placeholder:text-cream/50 focus:border-gold rounded-none h-12"
              required
            />
            <Button type="submit" variant="premium-gold" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>

          <p className="text-cream/40 text-xs mt-6">
            By subscribing, you agree to receive updates from Toto Finance. You can unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;