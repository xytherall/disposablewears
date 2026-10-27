"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  variantId: string;
  slug: string;
  productName: string;
  variantName: string;
  unit: string;
  price: number;
  quantity: number;
  art: string | null;
  imageUrl: string | null;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (item: CartItem) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dw-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loading the saved cart once on mount
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Ignore a broken or blocked cart in storage.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(10000, quantity)) } : i)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.quantity * i.price, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, ready, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
