import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import totoFinanceLogo from "@/assets/toto finance logo.svg";

const Footer = () => {
  const footerLinks = {
    asset: [
      { label: "Gold", href: "/category/gold", internal: true },
      { label: "Silver", href: "/category/silver", internal: true },
      { label: "Platinum", href: "/category/platinum", internal: true },
      { label: "Diamonds", href: "/category/diamonds", internal: true },
    ],
    resources: [
      { label: "Docs", href: "https://totofinance.co/doc-imprint", internal: false },
      { label: "Blog", href: "https://blog.totofinance.co/", internal: false },
      { label: "FAQ", href: "https://totofinance.co/faq", internal: false },
    ],
    company: [
      { label: "Tia Token", href: "https://toto.xyz/tia-token", internal: false },
      { label: "Careers", href: "https://totofinance.co/careers", internal: false },
      { label: "Products", href: "https://totofinance.co/products", internal: false },
    ],
    platform: [
      { label: "Toto Token", href: "http://toto.xyz/", internal: false },
      { label: "Products", href: "https://totofinance.co/products", internal: false },
      { label: "Ecosystem", href: "https://totofinance.co/ecosystem", internal: false },
      { label: "Vision 2030", href: "https://totofinance.co/vision-2030", internal: false },
    ],
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Brand - Full Width at Top */}
          <div>
            <Link to="/" className="inline-block">
              <img 
                src={totoFinanceLogo} 
                alt="Toto Finance" 
                className="h-8 lg:h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl">
              Building the Future of Global Trade
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-2xl">
              Toto Finance is an asset-backed tokenization platform that provides digital infrastructure for tokenized commodities, enabling instant settlement and compliant global trade across metals, energy, and real-world assets.
            </p>
          </div>

          {/* Links Sections - 4 Columns Below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Asset */}
            <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Asset</h4>
            <ul className="space-y-3">
              {footerLinks.asset.map((link) => (
                <li key={link.label}>
                  {link.internal ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Toto Finance. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;