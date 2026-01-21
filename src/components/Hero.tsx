import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import goldBackground from "@/assets/gold background.webp";
import silverBackground from "@/assets/silver background.webp";
import platinumBackground from "@/assets/platinum background.webp";
import diamondBackground from "@/assets/diamond background.webp";
import GoldSilverWidget from "./GoldSilverWidget";

const slides = [
  {
    id: 1,
    image: goldBackground,
    subtitle: "Building the Future of Global Trade",
    title: ["Toto", "Finance"],
    description: "Toto Finance is an asset-backed tokenization platform that provides digital infrastructure for tokenized commodities, enabling instant settlement and compliant global trade across metals, energy, and real-world assets.",
    primaryCta: "Explore Assets",
    secondaryCta: "Learn More",
    link: "/category/gold",
  },
  {
    id: 2,
    image: silverBackground,
    subtitle: "Exclusive Offers",
    title: ["Silver", "Refinement"],
    description: "Invest in digital silver with real-time pricing and secure transactions. Experience the elegance of precious metals.",
    primaryCta: "Start Investing",
    secondaryCta: "Learn More",
    link: "/category/silver",
  },
  {
    id: 3,
    image: platinumBackground,
    subtitle: "Premium Collection",
    title: ["Platinum", "Excellence"],
    description: "Explore our latest collection of handcrafted platinum jewelry and precious metal investments.",
    primaryCta: "View Collection",
    secondaryCta: "Discover",
    link: "/category/platinum",
  },
  {
    id: 4,
    image: diamondBackground,
    subtitle: "Timeless Brilliance",
    title: ["Diamonds", "Forever"],
    description: "Discover the eternal beauty of diamonds. Each stone is certified, tokenized, and secured in our vaults for your peace of mind.",
    primaryCta: "Explore Diamonds",
    secondaryCta: "Learn More",
    link: "/category/diamonds",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center pt-20 overflow-hidden">
      {/* Background with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative w-full">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-charcoal/80 text-sm tracking-[0.3em] uppercase mb-4"
              >
                {slide.subtitle}
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl text-charcoal font-light leading-tight mb-6"
              >
                {slide.title[0]}
                <br />
                {slide.title[1]}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-charcoal/70 text-lg md:text-xl mb-8 max-w-md"
              >
                {slide.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  variant="premium-light" 
                  size="xl"
                  onClick={() => navigate(slide.link)}
                >
                  {slide.primaryCta}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Gold/Silver Trading Widget */}
          <div className="hidden lg:block">
            <GoldSilverWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full text-charcoal hover:bg-white/30 transition-colors shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full text-charcoal hover:bg-white/30 transition-colors shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-charcoal w-8"
                : "bg-charcoal/40 hover:bg-charcoal/60 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-charcoal/60 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-charcoal/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
