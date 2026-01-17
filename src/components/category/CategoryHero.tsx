import { motion } from "framer-motion";

interface CategoryHeroProps {
  title: string;
  description: string;
}

const CategoryHero = ({ title, description }: CategoryHeroProps) => {
  return (
    <section className="relative h-[280px] md:h-[360px] bg-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />
      <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold text-sm tracking-widest uppercase mb-4">
            Premium Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream font-light mb-4">
            {title}
          </h1>
          <p className="text-cream/70 max-w-lg text-sm md:text-base">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryHero;

