import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { categories } from "@/data/catalog";
import { useLiveCatalog } from "@/lib/live-products";

type SearchParams = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    category: typeof search['category'] === "string" ? search['category'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Alphonso Mangoes & Konkan Products Online | Konkan Kokani" },
      {
        name: "description",
        content:
          "Browse Devgad Alphonso mango boxes, kokum, cashews, pickles and masalas. Filter by category, price and availability.",
      },
      { property: "og:title", content: "Shop Alphonso Mangoes & Konkan Products" },
      { property: "og:description", content: "Devgad mango boxes and authentic Kokani pantry staples, delivered across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(category ? [category] : []);
  const [maxPrice, setMaxPrice] = useState(4500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const products = useLiveCatalog();

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        (selected.length === 0 || selected.includes(p.category)) &&
        p.price <= maxPrice &&
        (!inStockOnly || p.stock > 0) &&
        (query.trim() === "" ||
          `${p.name} ${p.shortDescription} ${p.category}`.toLowerCase().includes(query.toLowerCase())),
    );
    out = [...out].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return a.slug.localeCompare(b.slug);
      return b.reviews - a.reviews;
    });
    return out;
  }, [products, selected, maxPrice, inStockOnly, query, sort]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Every box, jar and pouch from Konkan"
        description="Seasonal Devgad Alphonso alongside kokum, cashews, pickles and masalas sourced directly from families across the coast."
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-8" aria-label="Product filters">
          <div>
            <Label htmlFor="shop-search">Search</Label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="shop-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mango, kokum, cashew…"
                className="pl-9"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Category</legend>
            <div className="mt-3 space-y-2.5">
              {categories.map((c) => (
                <div key={c.slug} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`cat-${c.slug}`}
                    checked={selected.includes(c.slug)}
                    onCheckedChange={(v) =>
                      setSelected((prev) => (v ? [...prev, c.slug] : prev.filter((s) => s !== c.slug)))
                    }
                  />
                  <Label htmlFor={`cat-${c.slug}`} className="text-sm font-normal">
                    {c.name}
                  </Label>
                </div>
              ))}
            </div>
          </fieldset>

          <div>
            <Label htmlFor="price">Max price: ₹{maxPrice}</Label>
            <Slider
              id="price"
              className="mt-4"
              min={150}
              max={4500}
              step={50}
              value={[maxPrice]}
              onValueChange={([v]) => setMaxPrice(v ?? 4500)}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox id="stock" checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} />
            <Label htmlFor="stock" className="text-sm font-normal">
              In stock only
            </Label>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{list.length} products</p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm">
                Sort
              </Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger id="sort" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="surface-card mt-8 p-10 text-center">
              <h2 className="text-xl">No results found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search or clear the filters. Meanwhile, here are our most-loved boxes.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 3).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
