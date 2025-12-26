import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import GoldSilverWidget from "./GoldSilverWidget";

const slides = [
  {
    id: 1,
    image: heroImage,
    subtitle: "Winter Collection 2024",
    title: ["Timeless", "Elegance"],
    description: "Discover our curated selection of luxury fashion pieces, crafted for those who appreciate refined aesthetics.",
    primaryCta: "Shop Collection",
    secondaryCta: "Explore",
  },
  // {
  //   id: 2,
  //   image: heroImage,
  //   subtitle: "Exclusive Offers",
  //   title: ["Golden", "Investments"],
  //   description: "Invest in digital gold and silver with real-time pricing and secure transactions.",
  //   primaryCta: "Start Investing",
  //   secondaryCta: "Learn More",
  // },
  // {
  //   id: 3,
  //   image: heroImage,
  //   subtitle: "New Arrivals",
  //   title: ["Premium", "Collection"],
  //   description: "Explore our latest collection of handcrafted jewelry and precious metals.",
  //   primaryCta: "View Collection",
  //   secondaryCta: "Discover",
  // },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt="Luxury fashion collection featuring designer accessories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
                className="text-champagne text-sm tracking-[0.3em] uppercase mb-4"
              >
                {slide.subtitle}
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6"
              >
                {slide.title[0]}
                <br />
                {slide.title[1]}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-cream/80 text-lg md:text-xl mb-8 max-w-md"
              >
                {slide.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button variant="premium-light" size="xl">
                  {slide.primaryCta}
                </Button>
                <Button variant="premium-outline" size="xl" className="border-cream text-cream hover:bg-cream hover:text-charcoal">
                  {slide.secondaryCta}
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

      {/* Navigation Arrows - commented out for single slide */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-cream/10 backdrop-blur-sm rounded-full text-cream hover:bg-cream/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-cream/10 backdrop-blur-sm rounded-full text-cream hover:bg-cream/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button> */}

      {/* Dots Navigation - commented out for single slide */}
      {/* <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-cream w-6"
                : "bg-cream/40 hover:bg-cream/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-cream/60 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-cream/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
