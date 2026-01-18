import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: number) => boolean;
  hasItemInCart: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Check if product is already in cart
  const isInCart = (productId: number): boolean => {
    return items.some((item) => item.product.id === productId);
  };

  // Check if cart has any item
  const hasItemInCart = (): boolean => {
    return items.length > 0;
  };

  // Add to cart - returns false if cart already has an item, true if added
  const addToCart = (product: Product): boolean => {
    // STRICT RULE: Only ONE asset allowed in cart at any time
    if (hasItemInCart()) {
      toast.error("Cart limit reached", {
        description: "You can only have one asset in your cart at a time. Please remove the current item first.",
      });
      return false;
    }

    // Add new item
    setItems([{ product, quantity: 1 }]);
    return true;
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Update quantity - but for NFT assets, quantity should always be 1
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // For NFT assets, we don't allow quantity > 1
    // Just keep it at 1
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: 1 } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const getCartTotal = () =>
    items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const getCartCount = () => items.length; // Each item is unique, so count = number of items

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
        hasItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
