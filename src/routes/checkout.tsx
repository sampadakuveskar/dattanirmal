import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero } from "@/components/site/PageShell";
import { useCart } from "@/lib/cart";
import { inr } from "@/data/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Konkan Kokani Farms" },
      { name: "description", content: "Complete your order of Devgad Alphonso mangoes and Kokani products." },
      { property: "og:title", content: "Checkout | Konkan Kokani Farms" },
      { property: "og:description", content: "Complete your Konkan Kokani order securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

const steps = ["Customer", "Address", "Delivery", "Payment", "Confirmation"];

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("upi");
  const shipping = subtotal > 2500 || subtotal === 0 ? 0 : 120;

  return (
    <>
      <PageHero eyebrow="Checkout" title="A few details and it's on its way" />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <div>
          <ol className="mb-8 flex flex-wrap gap-2 text-xs">
            {steps.map((s, i) => (
              <li
                key={s}
                aria-current={i === step ? "step" : undefined}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                  i === step
                    ? "border-accent bg-accent text-accent-foreground"
                    : i < step
                      ? "border-leaf text-leaf"
                      : "border-border text-muted-foreground"
                }`}
              >
                {i < step && <Check className="size-3" aria-hidden />} {s}
              </li>
            ))}
          </ol>

          <div className="surface-card space-y-5 p-7">
            {step === 0 && (
              <Fields
                fields={[
                  ["fullname", "Full name", "text"],
                  ["email", "Email", "email"],
                  ["phone", "Phone", "tel"],
                ]}
              />
            )}
            {step === 1 && (
              <Fields
                fields={[
                  ["address1", "Address line 1", "text"],
                  ["address2", "Address line 2", "text"],
                  ["city", "City", "text"],
                  ["state", "State", "text"],
                  ["pin", "PIN code", "text"],
                ]}
              />
            )}
            {step === 2 && (
              <RadioGroup defaultValue="standard" className="space-y-3">
                {[
                  ["standard", "Standard delivery — 3-4 days", "Free over ₹2,500"],
                  ["express", "Express delivery — 1-2 days", "₹350"],
                ].map(([v, t, s]) => (
                  <Label key={v} htmlFor={v} className="flex items-center gap-3 rounded-xl border border-border p-4 font-normal">
                    <RadioGroupItem id={v} value={v!} />
                    <span>
                      <span className="block font-medium">{t}</span>
                      <span className="block text-sm text-muted-foreground">{s}</span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            )}
            {step === 3 && (
              <>
                <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
                  {[
                    ["upi", "UPI"],
                    ["card", "Credit / Debit Card"],
                    ["netbanking", "Net Banking"],
                    ["cod", "Cash on Delivery"],
                  ].map(([v, t]) => (
                    <Label key={v} htmlFor={v} className="flex items-center gap-3 rounded-xl border border-border p-4 font-normal">
                      <RadioGroupItem id={v} value={v!} />
                      {t}
                    </Label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Payments are processed by a secure provider. Card details are never stored on this site — connect
                  your payment gateway to go live.
                </p>
              </>
            )}
            {step === 4 && (
              <div className="py-6 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-[image:var(--gradient-sun)]">
                  <Check className="size-7 text-secondary" aria-hidden />
                </div>
                <h2 className="mt-4 font-serif text-2xl">Order placed</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A confirmation will be sent by email and WhatsApp once payments are connected.
                </p>
                <Button asChild className="mt-6">
                  <Link to="/account">View order status</Link>
                </Button>
              </div>
            )}

            {step < 4 && (
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (step === 3) clear();
                    setStep((s) => s + 1);
                  }}
                  disabled={lines.length === 0 && step === 0}
                >
                  {step === 3 ? "Place order" : "Continue"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <aside className="surface-card h-fit space-y-3 p-6 text-sm">
          <h2 className="font-serif text-xl">Summary</h2>
          {lines.length === 0 ? (
            <p className="text-muted-foreground">No items in cart.</p>
          ) : (
            lines.map((l) => (
              <p key={`${l.slug}-${l.variant}`} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {l.name} × {l.qty}
                </span>
                <span>{inr(l.price * l.qty)}</span>
              </p>
            ))
          )}
          <p className="flex justify-between border-t border-border pt-3 font-serif text-lg font-semibold">
            <span>Total</span>
            <span>{inr(subtotal + shipping)}</span>
          </p>
        </aside>
      </div>
    </>
  );
}

function Fields({ fields }: { fields: [string, string, string][] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([id, label, type]) => (
        <div key={id}>
          <Label htmlFor={id}>{label}</Label>
          <Input id={id} name={id} type={type} className="mt-2" />
        </div>
      ))}
    </div>
  );
}
