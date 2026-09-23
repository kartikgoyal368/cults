'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}`
  productId: string;
  name: string;
  price: string;
  priceNumber: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedItem: CartItem | null;
  isPopupVisible: boolean;
  dismissPopup: () => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  addToCart: (
    product: {
      id: string;
      name: string;
      price: string;
      image: string;
    },
    size?: string,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cults_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cults_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, isInitialized]);

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const addToCart = (
    product: {
      id: string;
      name: string;
      price: string;
      image: string;
    },
    size: string = 'L',
    quantity: number = 1
  ) => {
    const priceNumber = parsePrice(product.price);
    const cartItemId = `${product.id}-${size}`;

    const itemToAdd: CartItem = {
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      priceNumber,
      image: product.image,
      size,
      quantity,
    };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, itemToAdd];
      }
    });

    // Show professional "Added Successfully" popup
    setLastAddedItem(itemToAdd);
    setIsPopupVisible(true);

    // After 800ms, open the cart drawer so the user sees the popup, then the drawer slides in!
    setTimeout(() => {
      setIsCartOpen(true);
    }, 800);

    // Hide the popup notification smoothly
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3200);
  };

  const dismissPopup = () => {
    setIsPopupVisible(false);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQuantity } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (acc, it) => acc + it.priceNumber * it.quantity,
    0
  );

  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        lastAddedItem,
        isPopupVisible,
        dismissPopup,
        buyNowItem,
        setBuyNowItem,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
