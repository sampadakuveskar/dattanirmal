import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageShell";
import { useCart } from "@/lib/cart";
import { getProduct, inr } from "@/data/catalog";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account & Orders | Konkan Kokani Farms" },
      { name: "description", content: "Track your Devgad Alphonso orders, manage addresses and view your wishlist." },
      { property: "og:title", content: "My Account | Konkan Kokani Farms" },
      { property: "og:description", content: "Track orders, manage addresses and view your wishlist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

const timeline = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function Account() {
  const { wishlist, toggleWishlist } = useCart();

  return (
    <>
      <PageHero eyebrow="Account" title="Namaskar, welcome back" description="Demo dashboard — connect a backend to enable real sign-in and live orders." />
      <div className="container-page py-12">
        <Tabs defaultValue="orders">
          <TabsList className="flex-wrap">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="py-8">
            <div className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Order #KK-10428</p>
                  <p className="text-sm text-muted-foreground">1 × Devgad Alphonso Mango (12 pcs) · {inr(2150)}</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Shipped</span>
              </div>
              <ol className="mt-6 grid gap-3 sm:grid-cols-6">
                {timeline.map((t, i) => (
                  <li key={t} className="text-xs">
                    <span
                      className={`grid size-7 place-items-center rounded-full ${
                        i <= 3 ? "bg-[image:var(--gradient-sun)] text-secondary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i <= 3 ? <Check className="size-3.5" aria-hidden /> : i + 1}
                    </span>
                    <span className="mt-2 block">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="py-8">
            {wishlist.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing saved yet.{" "}
                <Link to="/shop" className="text-accent underline">
                  Browse products
                </Link>
                .
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {wishlist.map((slug) => {
                  const p = getProduct(slug);
                  if (!p) return null;
                  return (
                    <li key={slug} className="surface-card flex items-center gap-4 p-4">
                      <img src={p.image} alt={p.name} loading="lazy" width={120} height={120} className="size-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <Link to="/product/$slug" params={{ slug }} className="font-medium hover:text-accent">
                          {p.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{inr(p.price)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleWishlist(slug)}>
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="addresses" className="py-8">
            <div className="surface-card max-w-md p-6 text-sm">
              <p className="font-medium">Home</p>
              <p className="mt-1 text-muted-foreground">Flat 4B, Shivneri Apartments, Kothrud, Pune 411038</p>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="py-8">
            <div className="surface-card max-w-md space-y-2 p-6 text-sm">
              <p className="font-medium">Sampada K.</p>
              <p className="text-muted-foreground">sampada@example.com · +91 90000 00000</p>
              <Button variant="outline" size="sm" className="mt-3">
                Logout
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
