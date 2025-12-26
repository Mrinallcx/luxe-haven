import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, ShoppingBag, Gavel, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/contexts/AIChatContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import product images
import diamondProduct from "@/assets/diamond-product.webp";
import goldProduct from "@/assets/gold-product.webp";
import silverProduct from "@/assets/silver-product.webp";
import platinumProduct from "@/assets/platinum-product.webp";
import sapphireProduct from "@/assets/sapphire-product.webp";

interface Product {
  id: number;
  name: string;
  price: number;
  pricePerUnit: string;
  category: string;
  purity: string;
  weight: string;
  status: "sale" | "auction";
}

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-chat`;

const getProductImage = (category: string) => {
  switch (category.toLowerCase()) {
    case "diamonds": return diamondProduct;
    case "gold": return goldProduct;
    case "silver": return silverProduct;
    case "platinum": return platinumProduct;
    case "sapphire": return sapphireProduct;
    default: return diamondProduct;
  }
};

const ChatProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) => {
  const image = getProductImage(product.category);
  
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-background border border-border rounded-xl overflow-hidden hover:border-gold/50 transition-all group">
        <div className="relative aspect-square">
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1 ${
              product.status === "auction" 
                ? "bg-gold/90 text-charcoal" 
                : "bg-charcoal/90 text-cream"
            }`}>
              {product.status === "auction" ? (
                <><Gavel className="w-2.5 h-2.5" /> Auction</>
              ) : (
                <><Tag className="w-2.5 h-2.5" /> Sale</>
              )}
            </span>
          </div>
        </div>
        <div className="p-2.5">
          <h4 className="text-xs font-medium truncate group-hover:text-gold transition-colors">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-semibold">€{product.price.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground">{product.pricePerUnit}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
            <span>{product.purity}</span>
            <span>•</span>
            <span>{product.weight}</span>
          </div>
          <Button
            size="sm"
            className="w-full mt-2 h-7 text-xs rounded-lg gap-1"
            variant={product.status === "auction" ? "outline" : "default"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
          >
            {product.status === "auction" ? (
              <><Gavel className="w-3 h-3" /> Place Bid</>
            ) : (
              <><ShoppingBag className="w-3 h-3" /> Add to Cart</>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
};

const AIChatSidebar = () => {
  const { isOpen, closeChat } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAddToCart = (product: Product) => {
    if (product.status === "auction") {
      toast({
        title: "Auction Item",
        description: "Please visit the product page to place a bid.",
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      pricePerUnit: product.pricePerUnit,
      image: getProductImage(product.category),
      category: product.category,
      purity: product.purity,
      weight: product.weight,
      status: product.status,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment before sending another message.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Service unavailable",
          description: "AI service requires additional credits.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log("AI Response data:", data);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content || "",
        products: data.products,
      };
      
      console.log("Assistant message:", assistantMessage);
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeChat}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-lg">MAISON AI</h2>
                  <p className="text-xs text-muted-foreground">Your marketplace assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeChat}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-serif text-lg mb-2">Welcome to MAISON AI</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ask me anything about our precious metals and gems.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mb-6">
                    I can show you products, check live prices, and help you find what you need.
                  </p>
                  <div className="space-y-2 w-full">
                    {[
                      "Show me your diamond collection",
                      "What gold products do you have?",
                      "What is the current gold price?",
                      "Find sapphires under €15,000",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="w-full p-3 text-sm text-left bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index}>
                      <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" ? "bg-charcoal text-cream" : "bg-gold/20 text-gold"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                            message.role === "user"
                              ? "bg-charcoal text-cream rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            message.content ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:text-foreground">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : message.products && message.products.length > 0 ? (
                              <span>Here are some products for you:</span>
                            ) : (
                              <span className="text-muted-foreground italic">Processing your request...</span>
                            )
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                      
                      {/* Product Cards */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-3 ml-11">
                          <div className="grid grid-cols-2 gap-2">
                            {message.products.map((product) => (
                              <ChatProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => handleAddToCart(product)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, prices..."
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-muted border-0"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full bg-gold hover:bg-gold/90 text-charcoal"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatSidebar;
