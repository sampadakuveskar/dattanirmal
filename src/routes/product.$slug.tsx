import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Minus, Plus, Share2, Star, Truck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { getProduct, inr, reviews, stockLabel } from "@/data/catalog";
import { useLiveCatalog, useLiveProducts, mergeProduct } from "@/lib/live-products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Buy Online | Konkan Kokani` },
          { name: "description", content: loaderData.shortDescription },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.shortDescription },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
  }),
  component: ProductPage,
  errorComponent: () => <p className="container-page py-24">This product could not be loaded.</p>,
  notFoundComponent: () => <p className="container-page py-24">Product not found.</p>,
});

function ProductPage() {
  const base = Route.useLoaderData();
  const { map } = useLiveProducts();
  const products = useLiveCatalog();
  const product = useMemo(() => mergeProduct(base, map.get(base.slug)), [base, map]);
  const navigate = useNavigate();
  const { add, toggleWishlist, wishlist } = useCart();
  const [variantLabel, setVariantLabel] = useState(base.variants[0]!.label);
  const variant = product.variants.find((v) => v.label === variantLabel) ?? product.variants[0]!;
  const setVariant = (v: { label: string; price: number }) => setVariantLabel(v.label);
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const stock = stockLabel(product.stock);
  const wished = wishlist.includes(product.slug);

  const addToCart = () =>
    add(
      { slug: product.slug, name: product.name, variant: variant.label, price: variant.price, image: product.image },
      qty,
    );

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link to="/shop" className="hover:text-accent">
          Shop
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            width={1600}
            height={1200}
            className="aspect-4/3 w-full rounded-3xl border border-border object-cover shadow-[var(--shadow-card)]"
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} view ${i + 1}`}
                loading="lazy"
                width={400}
                height={300}
                className="aspect-square w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium">
              <Star className="size-4 fill-primary text-primary" aria-hidden /> {product.rating}
            </span>
            <span className="text-muted-foreground">{product.reviews} reviews</span>
            <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>{stock}</Badge>
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold">{inr(variant.price)}</span>
            {product.mrp > product.price && (
              <span className="text-muted-foreground line-through">{inr(product.mrp)}</span>
            )}
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
            </span>
          </p>

          <fieldset className="mt-7">
            <legend className="text-sm font-medium">Weight / Pack</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVariant(v)}
                  aria-pressed={v.label === variant.label}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    v.label === variant.label
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                {qty}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <Plus className="size-4" />
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              disabled={product.stock === 0}
              onClick={() => {
                addToCart();
                toast.success("Added to cart");
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              disabled={product.stock === 0}
              onClick={() => {
                addToCart();
                navigate({ to: "/cart" });
              }}
            >
              Buy Now
            </Button>
            <Button variant="ghost" size="icon" aria-label="Add to wishlist" onClick={() => toggleWishlist(product.slug)}>
              <Heart className={wished ? "fill-accent text-accent" : ""} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Share product"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
            >
              <Share2 />
            </Button>
          </div>

          <div className="surface-card mt-8 space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Truck className="size-4 text-leaf" aria-hidden /> Check delivery availability
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPinResult(
                  /^\d{6}$/.test(pin)
                    ? `Delivery available to ${pin} — expected in 2-4 days.`
                    : "Enter a valid 6-digit PIN code.",
                );
              }}
            >
              <Label htmlFor="pin" className="sr-only">
                PIN code
              </Label>
              <Input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN code" inputMode="numeric" />
              <Button type="submit" variant="secondary">
                Check
              </Button>
            </form>
            {pinResult && (
              <p className="text-sm text-muted-foreground" role="status">
                {pinResult}
              </p>
            )}
            {product.type === "mango" && (
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent" aria-hidden /> Origin: Devgad, Maharashtra
                </li>
                <li>Naturally ripened</li>
                <li>Seasonal availability</li>
                <li>Farm fresh, packed to order</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-16">
        <TabsList className="flex-wrap">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="max-w-3xl py-6 text-muted-foreground">
          {product.description}
        </TabsContent>
        <TabsContent value="details" className="py-6">
          <dl className="grid max-w-lg gap-3 text-sm">
            {[
              ["Weight", product.weight],
              ["Category", product.category.replace(/-/g, " ")],
              ["Packing", "Cushioned carton, hygienically packed"],
              ["Storage", "Cool, dry place away from direct sunlight"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-border pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium capitalize">{v}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="shipping" className="max-w-3xl py-6 text-muted-foreground">
          Orders are dispatched within 24-48 hours of packing. Mango boxes ship by air or surface depending on your
          location, typically arriving in 2-4 days with tracking shared over WhatsApp and email.
        </TabsContent>
        <TabsContent value="returns" className="max-w-3xl py-6 text-muted-foreground">
          If a box arrives damaged, share photos within 24 hours of delivery and we will replace or refund the
          affected fruit. Opened pantry products cannot be returned.
        </TabsContent>
        <TabsContent value="reviews" className="py-6">
          <ul className="grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.name} className="surface-card p-5">
                <p className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-primary text-primary" aria-hidden />
                  ))}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-3 text-sm font-medium">
                  {r.name} · <span className="text-muted-foreground">{r.city}</span>
                </p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Frequently bought together</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((p) => p.slug !== product.slug)
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
