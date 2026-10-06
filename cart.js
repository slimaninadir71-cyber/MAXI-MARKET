'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { lineKey } from './format';

const KEY = 'maximarket-panier-v1';
const MAX_QTY = 10;
const Ctx = createContext(null);

const clean = (list) =>
  (Array.isArray(list) ? list : [])
    .filter((l) => l && typeof l.slug === 'string' && typeof l.size === 'string' && Number.isFinite(l.quantity))
    .map((l) => ({ slug: l.slug, size: l.size, color: typeof l.color === 'string' ? l.color : '', quantity: Math.min(Math.max(Math.round(l.quantity), 1), MAX_QTY) }));

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setLines(clean(JSON.parse(raw)));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, ready]);

  const add = useCallback((slug, size, color = '', quantity = 1) => {
    const item = { slug, size, color, quantity };
    setLines((prev) => {
      const k = lineKey(item);
      if (prev.some((l) => lineKey(l) === k)) return clean(prev.map((l) => (lineKey(l) === k ? { ...l, quantity: l.quantity + quantity } : l)));
      return clean([...prev, item]);
    });
  }, []);
  const setQty = useCallback((key, quantity) => {
    setLines((prev) => clean(prev.map((l) => (lineKey(l) === key ? { ...l, quantity } : l))));
  }, []);
  const remove = useCallback((key) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const value = useMemo(() => ({ lines, ready, count, add, setQty, remove, clear, MAX_QTY }), [lines, ready, count, add, setQty, remove, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);

// Détails des produits du panier, lus depuis Supabase (prix toujours à jour).
export function useCartDetails() {
  const { lines, ready } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const key = [...new Set(lines.map((l) => l.slug))].sort().join('|');

  useEffect(() => {
    if (!ready) return;
    const slugs = key ? key.split('|') : [];
    if (slugs.length === 0) { setLoading(false); return; }
    let alive = true;
    supabase.from('products').select('slug,name,price,compare_at_price,images,sizes,colors,in_stock').in('slug', slugs)
      .then(({ data }) => {
        if (!alive) return;
        setProducts(Object.fromEntries((data || []).map((p) => [p.slug, p])));
        setLoading(false);
      });
    return () => { alive = false; };
  }, [key, ready]);

  const detailed = lines.filter((l) => products[l.slug]).map((l) => ({ ...l, key: lineKey(l), product: products[l.slug] }));
  const total = detailed.reduce((s, l) => s + Number(l.product.price) * l.quantity, 0);
  return { detailed, total, loading: loading || !ready };
}
