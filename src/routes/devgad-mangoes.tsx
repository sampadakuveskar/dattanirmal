import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { images, products, reviews } from "@/data/catalog";

export const Route = createFileRoute("/devgad-mangoes")({
  head: () => ({
    meta: [
      { title: "Buy Devgad Alphonso Hapus Mangoes Online | Konkan Kokani" },
      {
        name: "description",
        content:
          "Order naturally ripened Devgad Alphonso (Hapus) mangoes direct from Konkan orchards. Box sizes, season dates and delivery details.",
      },
      { property: "og:title", content: "Buy Devgad Alphonso Hapus Mangoes Online" },
      { property: "og:description", content: "Naturally ripened Devgad Alphonso mangoes, packed to order and shipped across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MangoPage,
});

const timeline = [
  ["Flowering", "Trees flower through the cool months along the coast."],
  ["Fruit development", "Fruit sets and matures with the rising summer heat."],
  ["Harvest", "Picked by hand at the right maturity, never shaken down."],
  ["Quality check", "Sorted by size and checked for blemishes."],
  ["Packing", "Ripened in grass beds, cushioned and boxed to order."],
  ["Delivery", "Dispatched with tracking, typically 2-4 days to your door."],
];

const faqs = [
  ["When is the season?", "Fruit is usually available from late March to early June, depending on the year's flowering."],
  ["How are the mangoes ripened?", "In traditional grass beds at ambient temperature. We do not use artificial ripening agents."],
  ["What if fruit arrives damaged?", "Share photos within 24 hours of delivery and we replace or refund the affected fruit."],
  ["How should I store them?", "Keep the box open at room temperature until fully ripe, then refrigerate for up to three days."],
];

function MangoPage() {
  const mangoes = products.filter((p) => p.type === "mango");

  return (
    <>
      <section className="relative border-b border-border bg-[image:var(--gradient-cream)]">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-accent">Devgad Alphonso</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
              Experience the taste of real Devgad Alphonso
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Alphonso grown around Devgad taluka has long been prized for its aroma and fine pulp. We buy from
              orchards we visit, pack in the same week, and ship only during the season.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/shop" search={{ category: "devgad-mangoes" }}>
                Order Your Devgad Alphonso
              </Link>
            </Button>
          </div>
          <img
            src={images.hero}
            alt="Ripe Devgad Alphonso mangoes with leaves"
            width={1600}
            height={1200}
            className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="The Journey" title="From flowering to your doorstep" />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map(([t, d], i) => (
            <li key={t} className="surface-card p-6">
              <span className="font-serif text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Box Sizes" title="Choose your box" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mangoes.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <section className="bg-muted/60">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="FAQ" title="Questions about the season" />
            <Accordion type="single" collapsible className="mt-8">
              {faqs.map(([q, a]) => (
                <AccordionItem key={q} value={q!}>
                  <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="space-y-4">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.name} className="surface-card p-6">
                <blockquote className="text-sm text-muted-foreground">{r.text}</blockquote>
                <figcaption className="mt-3 text-sm font-medium">
                  {r.name} · <span className="text-muted-foreground">{r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
