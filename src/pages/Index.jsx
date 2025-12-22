import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import PromotionalBoxes from "@/components/PromotionalBoxes";
import Footer from "@/components/Footer";
import styled from "styled-components";

const Page = styled.div`
  min-height: 100vh;
  background-color: hsl(var(--background));
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const Index = () => {
  return (
    <Page>
      <Header />
      <Main>
        <Hero />
        <FeaturedProducts />
        <FeaturedProducts title="New Arrivals" subtitle="Just In" />
        <Categories />
        <Services />
        <Newsletter />
        <PromotionalBoxes />
      </Main>
      <Footer />
    </Page>
  );
};

export default Index;