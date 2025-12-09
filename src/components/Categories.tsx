import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import categoryWomen from "@/assets/category-women.jpg";
import categoryMen from "@/assets/category-men.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import categoryFootwear from "@/assets/category-footwear.jpg";
import categoryJewelry from "@/assets/category-jewelry.jpg";

const categories = [
  {
    id: 1,
    name: "Diamonds",
    slug: "diamonds",
    description: "Brilliant cuts of eternal elegance",
    image: categoryWomen,
    count: 248,
  },
  {
    id: 2,
    name: "Gold",
    slug: "gold",
    description: "Timeless treasures in pure gold",
    image: categoryMen,
    count: 186,
  },
  {
    id: 3,
    name: "Silver",
    slug: "silver",
    description: "Refined silver for modern sophistication",
    image: categoryAccessories,
    count: 324,
  },
  {
    id: 4,
    name: "Platinum",
    slug: "platinum",
    description: "Rare luxury for the discerning collector",
    image: categoryFootwear,
    count: 156,
  },
  {
    id: 5,
    name: "Sapphire",
    slug: "sapphire",
    description: "Majestic gems of captivating beauty",
    image: categoryJewelry,
    count: 92,
  },
];

const CategoryCard = ({ category, index }: { category: typeof categories[0]; index: number }) => {
  return (
    <Link to={`/category/${category.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="group relative overflow-hidden cursor-pointer"
      >
        <div className="aspect-[4/3] lg:aspect-[3/2]">
          <img
            src={category.image}
            alt={`${category.name} collection`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-serif text-2xl lg:text-3xl text-cream mb-2">
                {category.name}
              </h3>
              <p className="text-cream/70 text-sm hidden md:block max-w-xs">
                {category.description}
              </p>
              <p className="text-cream/50 text-xs tracking-wider uppercase mt-2">
                {category.count} Products
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center group-hover:bg-cream group-hover:border-cream transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-cream group-hover:text-charcoal transition-colors duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Categories = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            Explore Collections
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;