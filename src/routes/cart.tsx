import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageShell";
import { useCart } from "@/lib/cart";
import { inr } from "@/data/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Konkan Kokani Farms" },
      { name: "description", content: "Review your Devgad Alphonso mango boxes and Kokani products before checkout." },
      { property: "og:title", content: "Your Cart | Konkan Kokani Farms" },
      { property: "og:description", content: "Review your mango boxes and Kokani products before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal === 0 ? 0 : subtotal > 2500 ? 0 : 120;
  const total = Math.max(0, subtotal - discount) + shipping;

  return (
    <>
      <PageHero eyebrow="Cart" title="Your basket from Konkan" />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_22rem]">
        <div>
          {lines.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <p className="font-serif text-xl">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Start with a box of Devgad Alphonso.</p>
              <Button asChild className="mt-6">
                <Link to="/shop">Browse products</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={`${l.slug}-${l.variant}`} className="surface-card flex flex-wrap items-center gap-4 p-4">
                  <img src={l.image} alt={l.name} loading="lazy" width={160} height={160} className="size-20 rounded-xl object-cover" />
                  <div className="min-w-40 flex-1">
                    <Link to="/product/$slug" params={{ slug: l.slug }} className="font-medium hover:text-accent">
                      {l.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{l.variant}</p>
                    <p className="mt-1 text-sm font-medium">{inr(l.price)}</p>
                  </div>
                  <div className="flex items-center rounded-full border border-border">
                    <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.variant, l.qty - 1)}>
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty(l.slug, l.variant, l.qty + 1)}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <p className="w-24 text-right font-serif text-lg">{inr(l.price * l.qty)}</p>
                  <Button variant="ghost" size="icon" aria-label={`Remove ${l.name}`} onClick={() => remove(l.slug, l.variant)}>
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="surface-card h-fit space-y-4 p-6">
          <h2 className="font-serif text-xl">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={inr(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
            {discount > 0 && <Row label="Discount" value={`- ${inr(discount)}`} />}
            <div className="border-t border-border pt-3">
              <Row label="Total" value={inr(total)} bold />
            </div>
          </dl>

          <form
            className="flex gap-2 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (coupon.trim().toUpperCase() === "KONKAN10") {
                setDiscount(Math.round(subtotal * 0.1));
                toast.success("Coupon applied — 10% off");
              } else {
                setDiscount(0);
                toast.error("Invalid coupon code");
              }
            }}
          >
            <Label htmlFor="coupon" className="sr-only">
              Coupon code
            </Label>
            <Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" />
            <Button type="submit" variant="secondary">
              Apply
            </Button>
          </form>

          <Button asChild className="w-full" size="lg" disabled={lines.length === 0}>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <p className="text-xs text-muted-foreground">Try code KONKAN10 for 10% off your first order.</p>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-serif text-lg font-semibold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
