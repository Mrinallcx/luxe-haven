import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import PromotionalBoxes from "@/components/PromotionalBoxes";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <FeaturedProducts title="New Arrivals" subtitle="Just In" />
        <Categories />
        <Services />
        <Newsletter />
        <PromotionalBoxes />
      </main>
      <Footer />
    </div>
  );
};

export default Index;