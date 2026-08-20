import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  slug: string;
  name: string;
  variant: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  wishlist: string[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (slug: string, variant: string) => void;
  setQty: (slug: string, variant: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (slug: string) => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "konkan-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { lines?: CartLine[]; wishlist?: string[] };
        setLines(parsed.lines ?? []);
        setWishlist(parsed.wishlist ?? []);
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, wishlist }));
    } catch {
      /* ignore quota errors */
    }
  }, [lines, wishlist]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === line.slug && l.variant === line.variant);
      if (i === -1) return [...prev, { ...line, qty }];
      const next = [...prev];
      next[i] = { ...next[i]!, qty: next[i]!.qty + qty };
      return next;
    });
  }, []);

  const remove = useCallback((slug: string, variant: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.variant === variant)));
  }, []);

  const setQty = useCallback((slug: string, variant: string, qty: number) => {
    setLines((prev) =>
      prev.flatMap((l) =>
        l.slug === slug && l.variant === variant ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l],
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      wishlist,
      add,
      remove,
      setQty,
      clear,
      toggleWishlist,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
    }),
    [lines, wishlist, add, remove, setQty, clear, toggleWishlist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
