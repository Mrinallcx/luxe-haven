import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

const DEFAULT_TITLE = "Toto Finance | Building the Future of Global Trade";
const DEFAULT_DESCRIPTION = "Toto Finance is an asset-backed tokenization platform that provides digital infrastructure for tokenized commodities, enabling instant settlement and compliant global trade across metals, energy, and real-world assets.";
const DEFAULT_KEYWORDS = "diamonds, gold, silver, platinum, sapphire, precious metals, gems, luxury, investment, jewelry, tokenization, asset-backed tokens, commodities";
// Get base URL dynamically - works for both staging and production
// Uses current window origin when available, falls back to production URL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // In browser: automatically use current origin (staging or production)
    return window.location.origin;
  }
  // Server-side or build time: use environment variable or default to production
  return import.meta.env.VITE_BASE_URL || "https://app.totofinance.co";
};

// BASE_URL will be calculated at runtime using current window origin
// This ensures it works for both staging (app-staging.totofinance.co) and production (app.totofinance.co)
const BASE_URL = getBaseUrl();

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
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) => {
  const fullTitle = title ? `${title} | Toto Finance` : DEFAULT_TITLE;
  // Use current origin dynamically (works for staging and production)
  const currentBaseUrl = typeof window !== "undefined" ? window.location.origin : BASE_URL;
  const canonicalUrl = canonical || url || (typeof window !== "undefined" ? window.location.href : currentBaseUrl);
  const ogImage = image || `${currentBaseUrl}/og-image.webp`;

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

    // Remove meta tag if exists
    const removeMetaTag = (name: string, property = false) => {
      const attr = property ? "property" : "name";
      const meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.remove();
      }
    };

    // Robots meta tag
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }

    // Standard meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Canonical URL
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:site_name", "Toto Finance", true);
    updateMetaTag("og:locale", "en_US", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);
    updateMetaTag("twitter:site", "@TotoFinance");
    updateMetaTag("twitter:creator", "@TotoFinance");

    // Structured Data
    if (structuredData) {
      let structuredDataScript = document.querySelector("script[type='application/ld+json']") as HTMLScriptElement;
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.setAttribute("type", "application/ld+json");
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }

    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [fullTitle, description, keywords, image, url, type, canonical, canonicalUrl, ogImage, noindex, structuredData]);

  return null;
};

export default SEO;

// Pre-configured SEO for common pages
export const PageSEO = {
  Home: () => (
    <SEO 
      description="Toto Finance is an asset-backed tokenization platform that provides digital infrastructure for tokenized commodities, enabling instant settlement and compliant global trade across metals, energy, and real-world assets."
      keywords="diamonds, gold, silver, platinum, sapphire, precious metals, gems, luxury, investment, tokenization, asset-backed tokens, commodities"
    />
  ),
  
  Category: ({ name, url }: { name: string; url?: string }) => {
    const currentBaseUrl = typeof window !== "undefined" ? window.location.origin : BASE_URL;
    const categoryUrl = url || `${currentBaseUrl}/category/${name.toLowerCase()}`;
    
    // Breadcrumb structured data
    const breadcrumbStructuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": currentBaseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `${name} Collection`,
          "item": categoryUrl
        }
      ]
    };

    return (
      <SEO 
        title={`${name} Collection`}
        description={`Explore our premium ${name.toLowerCase()} collection. Certified, authentic ${name.toLowerCase()} with exceptional quality and value.`}
        keywords={`${name.toLowerCase()}, buy ${name.toLowerCase()}, ${name.toLowerCase()} investment, premium ${name.toLowerCase()}`}
        url={categoryUrl}
        canonical={categoryUrl}
        structuredData={breadcrumbStructuredData}
      />
    );
  },
  
  Product: ({ name, price, category, image, url, productId, categoryUrl }: { name: string; price: number; category: string; image?: string; url?: string; productId?: string | number; categoryUrl?: string }) => {
    const currentBaseUrl = typeof window !== "undefined" ? window.location.origin : BASE_URL;
    const productUrl = url || (productId ? `${currentBaseUrl}/product/${productId}` : undefined);
    const productImage = image || `${currentBaseUrl}/og-image.webp`;
    const categoryLink = categoryUrl || `${currentBaseUrl}/category/${category.toLowerCase()}`;
    
    // Combined Product and Breadcrumb structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": name,
          "description": `${name} - Premium ${category} available at Toto Finance. Price: $${price.toLocaleString()}. Certified quality with authenticity guarantee.`,
          "image": productImage,
          "brand": {
            "@type": "Brand",
            "name": "Toto Finance"
          },
          "offers": {
            "@type": "Offer",
            "url": productUrl,
            "priceCurrency": "USD",
            "price": price,
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Toto Finance"
            }
          },
          "category": category
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": currentBaseUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": `${category} Collection`,
              "item": categoryLink
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": name,
              "item": productUrl
            }
          ]
        }
      ]
    };

    return (
      <SEO 
        title={name}
        description={`${name} - Premium ${category} available at Toto Finance. Price: $${price.toLocaleString()}. Certified quality with authenticity guarantee.`}
        keywords={`${name}, ${category}, luxury gems, precious metals, tokenized assets`}
        type="product"
        image={productImage}
        url={productUrl}
        canonical={productUrl}
        structuredData={structuredData}
      />
    );
  },
  
  Account: () => {
    const currentBaseUrl = typeof window !== "undefined" ? window.location.origin : BASE_URL;
    return (
      <SEO 
        title="My Account"
        description="Manage your Toto Finance account, view orders, and track your tokenized assets portfolio."
        url={`${currentBaseUrl}/account`}
        canonical={`${currentBaseUrl}/account`}
        noindex={true}
      />
    );
  },
  
  Cart: () => {
    const currentBaseUrl = typeof window !== "undefined" ? window.location.origin : BASE_URL;
    return (
      <SEO 
        title="Shopping Cart"
        description="Review your selected items and proceed to checkout at Toto Finance."
        url={`${currentBaseUrl}/cart`}
        canonical={`${currentBaseUrl}/cart`}
        noindex={true}
      />
    );
  },
};

