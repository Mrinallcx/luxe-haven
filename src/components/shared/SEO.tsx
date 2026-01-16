import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
}

const DEFAULT_TITLE = "MAISON | Luxury Precious Metals & Gems";
const DEFAULT_DESCRIPTION = "Discover exquisite diamonds, gold, silver, platinum, and sapphires. Premium quality precious metals and gems for discerning collectors and investors.";
const DEFAULT_KEYWORDS = "diamonds, gold, silver, platinum, sapphire, precious metals, gems, luxury, investment, jewelry";

/**
 * SEO component for managing page meta tags
 * Updates document title and meta tags for better search engine visibility
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image,
  url,
  type = "website",
}: SEOProps) => {
  const fullTitle = title ? `${title} | MAISON` : DEFAULT_TITLE;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    if (url) updateMetaTag("og:url", url, true);
    if (image) updateMetaTag("og:image", image, true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    if (image) updateMetaTag("twitter:image", image);

    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [fullTitle, description, keywords, image, url, type]);

  return null;
};

export default SEO;

// Pre-configured SEO for common pages
export const PageSEO = {
  Home: () => (
    <SEO 
      description="Discover exquisite diamonds, gold, silver, platinum, and sapphires at MAISON. Premium quality precious metals and gems for discerning collectors and investors."
      keywords="diamonds, gold, silver, platinum, sapphire, precious metals, gems, luxury, investment"
    />
  ),
  
  Category: ({ name }: { name: string }) => (
    <SEO 
      title={`${name} Collection`}
      description={`Explore our premium ${name.toLowerCase()} collection. Certified, authentic ${name.toLowerCase()} with exceptional quality and value.`}
      keywords={`${name.toLowerCase()}, buy ${name.toLowerCase()}, ${name.toLowerCase()} investment, premium ${name.toLowerCase()}`}
    />
  ),
  
  Product: ({ name, price, category }: { name: string; price: number; category: string }) => (
    <SEO 
      title={name}
      description={`${name} - Premium ${category} available at MAISON. Price: $${price.toLocaleString()}. Certified quality with authenticity guarantee.`}
      keywords={`${name}, ${category}, luxury gems, precious metals`}
      type="product"
    />
  ),
  
  Account: () => (
    <SEO 
      title="My Account"
      description="Manage your MAISON account, view orders, and track your precious metals portfolio."
    />
  ),
  
  Cart: () => (
    <SEO 
      title="Shopping Cart"
      description="Review your selected items and proceed to checkout at MAISON."
    />
  ),
};

