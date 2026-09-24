"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variant?: string;
};

type StoreCtx = {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (p: Product, qty?: number, variant?: string) => void;
  updateQty: (slug: string, variant: string | undefined, qty: number) => void;
  removeFromCart: (slug: string, variant?: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  promo: string | null;
  setPromo: (v: string | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>("b7_cart", []));
    setWishlist(read<string[]>("b7_wishlist", []));
    setPromo(read<string | null>("b7_promo", null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("b7_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("b7_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("b7_promo", JSON.stringify(promo));
  }, [promo, hydrated]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t: number })._t = window.setTimeout(() => setToast(null), 2600);
  };

  const addToCart: StoreCtx["addToCart"] = (p, qty = 1, variant) => {
    setCart((prev) => {
      const key = (i: CartItem) => i.slug === p.slug && (i.variant ?? "") === (variant ?? "");
      const found = prev.find(key);
      if (found) return prev.map((i) => (key(i) ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
      return [...prev, { slug: p.slug, name: p.name, image: p.images[0], price: p.price, qty, variant }];
    });
    setCartOpen(true);
    showToast(`${p.name} added to cart`);
  };

  const updateQty: StoreCtx["updateQty"] = (slug, variant, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => !(i.slug === slug && (i.variant ?? "") === (variant ?? ""))));
      return;
    }
    setCart((prev) => prev.map((i) => (i.slug === slug && (i.variant ?? "") === (variant ?? "") ? { ...i, qty: Math.min(99, qty) } : i)));
  };

  const removeFromCart: StoreCtx["removeFromCart"] = (slug, variant) => {
    setCart((prev) => prev.filter((i) => !(i.slug === slug && (i.variant ?? "") === (variant ?? ""))));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      const has = prev.includes(slug);
      showToast(has ? "Removed from wishlist" : "Saved to wishlist ♥");
      return has ? prev.filter((s) => s !== slug) : [...prev, slug];
    });
  };
  const isWishlisted = (slug: string) => wishlist.includes(slug);

  const { cartCount, subtotal } = useMemo(() => {
    return {
      cartCount: cart.reduce((a, i) => a + i.qty, 0),
      subtotal: cart.reduce((a, i) => a + i.qty * i.price, 0),
    };
  }, [cart]);

  const value: StoreCtx = {
    cart, cartCount, subtotal, addToCart, updateQty, removeFromCart, clearCart,
    wishlist, toggleWishlist, isWishlisted, quickView, setQuickView,
    cartOpen, setCartOpen, promo, setPromo, toast, showToast,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
