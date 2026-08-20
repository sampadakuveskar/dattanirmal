import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";
import { Section, SectionHeading } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, products } from "@/data/catalog";

export const Route = createFileRoute("/kokani-products")({
  head: () => ({
    meta: [
      { title: "Authentic Kokani & Konkan Food Products Online | Konkan Kokani" },
      {
        name: "description",
        content:
          "Kokum syrup, sol kadhi mix, Konkan cashews, mango pickle, masalas and coconut products — traditional Kokani foods delivered across India.",
      },
      { property: "og:title", content: "Authentic Kokani & Konkan Food Products" },
      { property: "og:description", content: "Traditional Konkan pantry staples sourced directly from coastal Maharashtra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KokaniPage,
});

function KokaniPage() {
  const items = products.filter((p) => p.type === "kokani");

  return (
    <>
      <PageHero
        eyebrow="Kokani Products"
        title="Traditional flavours from the Konkan coast"
        description="Kokum, cashews, pickles, masalas and snacks made in small batches by families across coastal Maharashtra."
      />

      <Section>
        <SectionHeading eyebrow="Categories" title="Browse by category" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((c) => c.slug !== "devgad-mangoes")
            .map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="surface-card group p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <h3 className="font-serif text-xl group-hover:text-accent">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.blurb}</p>
              </Link>
            ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Pantry" title="All Kokani products" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>
    </>
  );
}
