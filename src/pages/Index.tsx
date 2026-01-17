import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import PromotionalBoxes from "@/components/PromotionalBoxes";
import Footer from "@/components/Footer";
import { PageSEO } from "@/components/shared/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO.Home />
      <Header />
      <main>
        <Hero />
        <FeaturedProducts title="Featured Pieces" defaultSaleType="FIXEDPRICE" />
        <FeaturedProducts title="New Arrivals" defaultSaleType="FIXEDPRICE" showStatusFilter={false} shuffleProducts={true} reducedTopPadding={true} />
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