import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageShell";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Konkan Kokani Farms | Orders & Support" },
      {
        name: "description",
        content: "Questions about mango orders, bulk gifting or delivery? Call, email or message us on WhatsApp.",
      },
      { property: "og:title", content: "Contact Konkan Kokani Farms" },
      { property: "og:description", content: "Reach us for orders, bulk gifting and delivery questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us about your order" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="surface-card space-y-5 p-7"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const parsed = schema.safeParse(Object.fromEntries(fd));
              if (!parsed.success) {
                const next: Record<string, string> = {};
                for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
                setErrors(next);
                return;
              }
              setErrors({});
              e.currentTarget.reset();
              toast.success("Thanks — we'll get back to you within one working day.");
            }}
          >
            {[
              { id: "name", label: "Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "phone", label: "Phone (optional)", type: "tel" },
              { id: "subject", label: "Subject", type: "text" },
            ].map((f) => (
              <div key={f.id}>
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} name={f.id} type={f.type} className="mt-2" aria-invalid={Boolean(errors[f.id])} />
                {errors[f.id] && <p className="mt-1.5 text-xs text-destructive">{errors[f.id]}</p>}
              </div>
            ))}
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} className="mt-2" aria-invalid={Boolean(errors['message'])} />
              {errors['message'] && <p className="mt-1.5 text-xs text-destructive">{errors['message']}</p>}
            </div>
            <Button type="submit" size="lg">
              Send message
            </Button>
          </form>

          <div className="space-y-6">
            <div className="surface-card space-y-4 p-7 text-sm">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-accent" aria-hidden />
                Packing House, Devgad, Sindhudurg, Maharashtra 416613
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-accent" aria-hidden />
                <a href="tel:+919000000000">+91 90000 00000</a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="size-4 text-accent" aria-hidden />
                <a href="mailto:hello@konkankokani.in">hello@konkankokani.in</a>
              </p>
              <Button asChild variant="secondary" className="w-full">
                <a href="https://wa.me/919000000000">
                  <MessageCircle className="size-4" /> Chat With Us
                </a>
              </Button>
            </div>
            <div className="grid h-56 place-items-center rounded-2xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
              Map placeholder — connect Google Maps here
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
