import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero } from "@/components/site/PageShell";
import { useCart } from "@/lib/cart";
import { inr } from "@/data/catalog";
import { createOrder } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";

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

type Delivery = "standard" | "express";
type Payment = "upi" | "card" | "netbanking" | "cod";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
};

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const placeOrder = useServerFn(createOrder);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [delivery, setDelivery] = useState<Delivery>("standard");
  const [payment, setPayment] = useState<Payment>("upi");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number } | null>(null);

  const shipping = delivery === "express" ? 350 : subtotal > 2500 || subtotal === 0 ? 0 : 120;
  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validForStep(s: number): boolean {
    if (s === 0)
      return (
        form.fullName.trim().length >= 2 &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) &&
        form.phone.trim().length >= 6
      );
    if (s === 1)
      return (
        form.address1.trim().length >= 3 &&
        form.city.trim().length >= 2 &&
        form.state.trim().length >= 2 &&
        form.pincode.trim().length >= 4
      );
    return true;
  }

  async function submit() {
    if (placing) return;
    setPlacing(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.info("Please sign in to place your order");
        navigate({ to: "/auth", search: { redirect: "/checkout" } });
        return;
      }
      const result = await placeOrder({
        data: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          deliveryMethod: delivery,
          paymentMethod: payment,
          items: lines.map((l) => ({
            slug: l.slug,
            name: l.name,
            variant: l.variant,
            price: l.price,
            qty: l.qty,
          })),
        },
      });
      setPlaced(result);
      clear();
      setStep(4);
    } catch {
      toast.error("Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

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
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="fullname" label="Full name" value={form.fullName} onChange={set("fullName")} />
                <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} />
                <Field id="phone" label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="address1" label="Address line 1" value={form.address1} onChange={set("address1")} />
                <Field id="address2" label="Address line 2 (optional)" value={form.address2} onChange={set("address2")} />
                <Field id="city" label="City" value={form.city} onChange={set("city")} />
                <Field id="state" label="State" value={form.state} onChange={set("state")} />
                <Field id="pin" label="PIN code" value={form.pincode} onChange={set("pincode")} />
              </div>
            )}
            {step === 2 && (
              <RadioGroup value={delivery} onValueChange={(v) => setDelivery(v as Delivery)} className="space-y-3">
                {[
                  ["standard", "Standard delivery — 3-4 days", subtotal > 2500 ? "Free" : "₹120 · free over ₹2,500"],
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
                <RadioGroup value={payment} onValueChange={(v) => setPayment(v as Payment)} className="space-y-3">
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
            {step === 4 && placed && (
              <div className="py-6 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-[image:var(--gradient-sun)]">
                  <Check className="size-7 text-secondary" aria-hidden />
                </div>
                <h2 className="mt-4 font-serif text-2xl">Order placed</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Order <span className="font-medium text-foreground">#{placed.orderNumber}</span> ·{" "}
                  {inr(placed.total)} — track it anytime from your account.
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
                  onClick={() => (step === 3 ? submit() : setStep((s) => s + 1))}
                  disabled={(lines.length === 0 && step === 0) || !validForStep(step) || placing}
                >
                  {step === 3 ? (placing ? "Placing order…" : "Place order") : "Continue"}
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
            <>
              {lines.map((l) => (
                <p key={`${l.slug}-${l.variant}`} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {l.name} × {l.qty}
                  </span>
                  <span>{inr(l.price * l.qty)}</span>
                </p>
              ))}
              <p className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{shipping === 0 ? "Free" : inr(shipping)}</span>
              </p>
            </>
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

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} value={value} onChange={onChange} className="mt-2" />
    </div>
  );
}
