import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listLiveProducts, type LiveProduct } from "@/lib/shop.functions";
import { products as staticProducts, type Product } from "@/data/catalog";

/** Merge live database price / mrp / stock onto the static catalog entry. */
export function mergeProduct(p: Product, live: LiveProduct | undefined): Product {
  if (!live) return p;
  const delta = live.price - p.price;
  return {
    ...p,
    price: live.price,
    mrp: live.mrp > 0 ? live.mrp : p.mrp,
    stock: live.stock,
    variants: p.variants.map((v, i) =>
      i === 0 ? { ...v, price: live.price } : { ...v, price: Math.max(0, v.price + delta) },
    ),
  };
}

export function useLiveProducts() {
  const fetchLive = useServerFn(listLiveProducts);
  const query = useQuery({
    queryKey: ["live-products"],
    queryFn: () => fetchLive(),
    staleTime: 30_000,
  });

  const map = useMemo(() => {
    const m = new Map<string, LiveProduct>();
    for (const row of query.data ?? []) m.set(row.slug, row);
    return m;
  }, [query.data]);

  // Only enforce visibility once we actually received rows from the database.
  const ready = map.size > 0;
  return { map, ready };
}

/** Full catalog with live pricing/stock applied and hidden (inactive) products removed. */
export function useLiveCatalog(): Product[] {
  const { map, ready } = useLiveProducts();
  return useMemo(() => {
    if (!ready) return staticProducts;
    return staticProducts.filter((p) => map.has(p.slug)).map((p) => mergeProduct(p, map.get(p.slug)));
  }, [map, ready]);
}
