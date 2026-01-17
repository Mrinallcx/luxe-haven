import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Info, HandCoins, Eye, Check, X } from "lucide-react";
import { TiamondDetails } from "@/lib/market-api";
import { formatTimeRemaining, OfferType } from "@/utils/product-helpers";
import AcceptOfferModal from "@/components/AcceptOfferModal";
import CounterOfferModal from "@/components/CounterOfferModal";
import ViewOfferModal from "@/components/ViewOfferModal";

interface ProductTabsProps {
  tiamondDetails: TiamondDetails | null;
  categoryLabel: string;
  offers: OfferType[];
  productPrice: number;
}

const ProductTabs = ({ tiamondDetails, categoryLabel, offers, productPrice }: ProductTabsProps) => {
  const [selectedOffer, setSelectedOffer] = useState<OfferType | null>(null);
  const [counterOffer, setCounterOffer] = useState<OfferType | null>(null);
  const [viewOffer, setViewOffer] = useState<OfferType | null>(null);
  const [, setTick] = useState(0);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-muted/20 rounded-lg p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 text-xs sm:text-sm">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2 text-xs sm:text-sm">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Insurance</span>
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2 text-xs sm:text-sm">
            <HandCoins className="w-4 h-4" />
            <span className="hidden sm:inline">Offers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
          <h3 className="font-serif font-light text-foreground mb-3">Product Overview</h3>
          {tiamondDetails?.tiamond?.description ? (
            <div 
              className="text-sm text-muted-foreground leading-relaxed mb-4 prose prose-sm max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: tiamondDetails.tiamond.description }}
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              This exquisite piece represents the pinnacle of quality and craftsmanship. 
              Each asset is carefully selected and verified to meet our stringent standards.
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Edition</p>
              <p className="text-foreground font-medium">{tiamondDetails?.market?.edition || categoryLabel}</p>
            </div>
            {tiamondDetails?.market?.shape && (
              <div>
                <p className="text-muted-foreground">Shape</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.shape}</p>
              </div>
            )}
            {tiamondDetails?.market?.cut && (
              <div>
                <p className="text-muted-foreground">Cut</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.cut}</p>
              </div>
            )}
            {tiamondDetails?.market?.color && (
              <div>
                <p className="text-muted-foreground">Color</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.color}</p>
              </div>
            )}
            {tiamondDetails?.market?.clarity && (
              <div>
                <p className="text-muted-foreground">Clarity</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.clarity}</p>
              </div>
            )}
            {tiamondDetails?.market?.carat && (
              <div>
                <p className="text-muted-foreground">Carat</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.carat} ct</p>
              </div>
            )}
            {/* Platinum/Gold/Silver specific fields */}
            {tiamondDetails?.market?.platinumWeight && (
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.platinumWeight} oz</p>
              </div>
            )}
            {tiamondDetails?.market?.platinumFineness && (
              <div>
                <p className="text-muted-foreground">Fineness</p>
                <p className="text-foreground font-medium">{tiamondDetails.market.platinumFineness}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
          <h3 className="font-serif font-light text-foreground mb-3">Certificates & Documents</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            All documents are available for download after purchase and stored securely in your account.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <span className="text-sm text-foreground">Certificate of Authenticity</span>
              </div>
              <span className="text-xs text-muted-foreground">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <span className="text-sm text-foreground">Quality Assessment Report</span>
              </div>
              <span className="text-xs text-muted-foreground">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <span className="text-sm text-foreground">Provenance Documentation</span>
              </div>
              <span className="text-xs text-muted-foreground">PDF</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
          <h3 className="font-serif font-light text-foreground mb-3">Insurance Coverage</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Your asset is fully insured from the moment of purchase, at no additional cost.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Full Value Coverage</p>
                <p className="text-xs text-muted-foreground">100% coverage against theft, loss, or damage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Secure Storage</p>
                <p className="text-xs text-muted-foreground">Stored in high-security vaulted facilities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Transfer Protection</p>
                <p className="text-xs text-muted-foreground">Coverage continues during ownership transfers</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="bg-muted/20 border border-border rounded-lg p-5 mt-4">
          <h3 className="font-serif font-light text-foreground mb-3">Current Offers</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Review and respond to offers from other collectors.
          </p>
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">
                    ${Math.floor(productPrice * offer.priceMultiplier).toLocaleString()} {offer.token}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires in {formatTimeRemaining(offer.expiresAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setViewOffer(offer)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 bg-gold hover:bg-gold/90 text-charcoal gap-1"
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 gap-1"
                    onClick={() => setCounterOffer(offer)}
                  >
                    Counter
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AcceptOfferModal
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
        price={selectedOffer ? Math.floor(productPrice * selectedOffer.priceMultiplier) : 0}
        token={selectedOffer?.token || "LCX"}
        expiresAt={selectedOffer?.expiresAt || 0}
      />
      
      <CounterOfferModal
        open={!!counterOffer}
        onOpenChange={(open) => !open && setCounterOffer(null)}
        originalPrice={counterOffer ? Math.floor(productPrice * counterOffer.priceMultiplier) : 0}
        token={counterOffer?.token || "LCX"}
        expiresAt={counterOffer?.expiresAt || 0}
      />
      
      <ViewOfferModal
        open={!!viewOffer}
        onOpenChange={(open) => !open && setViewOffer(null)}
        originalPrice={viewOffer ? Math.floor(productPrice * viewOffer.priceMultiplier) : 0}
        counteredPrice={viewOffer ? Math.floor(productPrice * viewOffer.priceMultiplier * 1.1) : 0}
        token={viewOffer?.token || "LCX"}
        expiresAt={viewOffer?.expiresAt || 0}
      />
    </>
  );
};

export default ProductTabs;

