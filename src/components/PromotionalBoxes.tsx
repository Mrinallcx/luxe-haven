import { motion } from "framer-motion";

const PromotionalBoxes = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Box - Gold Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative bg-gold rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-end overflow-hidden"
          >
            {/* Decorative Star */}
            <div className="absolute top-8 left-8">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-cream"
              >
                <path
                  d="M30 0L33.5 20.5L54 15L40 30L54 45L33.5 39.5L30 60L26.5 39.5L6 45L20 30L6 15L26.5 20.5L30 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream font-light leading-tight mb-4">
                From Real Assets<br />
                to Real Ownership
              </h3>
              <p className="text-cream/80 text-sm md:text-base max-w-xs">
                Confidence in every asset: verified, secure, and deliverable.
              </p>
            </div>
          </motion.div>

          {/* Right Box - Light Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-3 relative bg-cream rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col overflow-hidden"
          >
            {/* Decorative Diamond Stars */}
            <div className="absolute top-8 right-8">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-champagne"
              >
                <path
                  d="M40 0L42 38L80 40L42 42L40 80L38 42L0 40L38 38L40 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-light leading-tight">
                Tokenized.<br />
                Trusted.<br />
                Tangible.
              </h3>
            </div>

            {/* Gold Bars Illustration */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
              <svg
                width="200"
                height="120"
                viewBox="0 0 200 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Bottom bar */}
                <defs>
                  <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#F5E6A3" />
                    <stop offset="100%" stopColor="#C5A028" />
                  </linearGradient>
                  <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5C848" />
                    <stop offset="50%" stopColor="#FDF5D8" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                  <linearGradient id="goldGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B8972E" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#C5A028" />
                  </linearGradient>
                </defs>
                
                {/* Bottom layer */}
                <path d="M20 100L40 85L180 85L160 100H20Z" fill="url(#goldGradient3)" />
                <path d="M40 85L50 75L170 75L180 85H40Z" fill="url(#goldGradient2)" />
                <path d="M50 75L40 85L20 100L30 90L50 75Z" fill="url(#goldGradient1)" />
                
                {/* Middle layer */}
                <path d="M35 75L55 60L155 60L135 75H35Z" fill="url(#goldGradient3)" />
                <path d="M55 60L65 50L145 50L155 60H55Z" fill="url(#goldGradient2)" />
                <path d="M65 50L55 60L35 75L45 65L65 50Z" fill="url(#goldGradient1)" />
                
                {/* Top layer */}
                <path d="M55 50L75 35L125 35L105 50H55Z" fill="url(#goldGradient3)" />
                <path d="M75 35L85 25L115 25L125 35H75Z" fill="url(#goldGradient2)" />
                <path d="M85 25L75 35L55 50L65 40L85 25Z" fill="url(#goldGradient1)" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBoxes;
