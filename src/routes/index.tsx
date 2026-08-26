import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Truck, ShieldCheck, PackageCheck, Star, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section, SectionHeading } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { products, categories, reviews, images } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Devgad Alphonso Mangoes & Kokani Products | Konkan Kokani Farms" },
      {
        name: "description",
        content:
          "Buy naturally ripened Devgad Alphonso mangoes and authentic Kokani products online — sourced direct from Konkan farms and delivered across India.",
      },
      { property: "og:title", content: "Devgad Alphonso Mangoes & Kokani Products" },
      {
        property: "og:description",
        content: "Naturally ripened Devgad Alphonso mangoes and traditional Konkan foods, delivered across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const badges = [
  { Icon: Leaf, label: "Direct From Farms" },
  { Icon: ShieldCheck, label: "100% Authentic Products" },
  { Icon: PackageCheck, label: "Hygienically Packed" },
  { Icon: Truck, label: "Delivery Across India" },
];

const steps = [
  { n: "01", title: "Select your products", text: "Pick mango boxes and Kokani staples from the seasonal catalogue." },
  { n: "02", title: "We pack with care", text: "Each fruit is checked by hand and cushioned before it leaves the shed." },
  { n: "03", title: "Shipped to you", text: "Dispatched the same week with tracking shared on WhatsApp and email." },
  { n: "04", title: "Enjoy Konkan at home", text: "Ripening guidance included so every mango is eaten at its best." },
];

function Home() {
  const mangoes = products.filter((p) => p.type === "mango");
  const kokani = products.filter((p) => p.type === "kokani").slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[image:var(--gradient-cream)]">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
              The Taste of Konkan
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Pure Devgad Alphonso.
              <span className="block text-gradient-sun">Straight From Konkan.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Authentic, naturally ripened Alphonso mangoes and traditional Kokani delicacies — carefully selected,
              beautifully packed, and full of authentic flavour.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/devgad-mangoes">Shop Devgad Mangoes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/kokani-products">Explore Kokani Products</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                ["40+", "Partner farms"],
                ["12k+", "Boxes delivered"],
                ["4.8/5", "Customer rating"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-serif text-2xl font-semibold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <Leaf
              className="animate-leaf absolute -left-4 top-6 size-10 text-leaf/40"
              aria-hidden
            />
            <Leaf
              className="animate-leaf absolute -right-2 bottom-10 size-14 text-leaf/30 [animation-delay:1.5s]"
              aria-hidden
            />
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
              <img
                src={images.hero4}
                alt="Freshly harvested Devgad Alphonso mangoes in a basket with mango leaves"
                width={1600}
                height={1200}
                className="aspect-4/3 w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/70 bg-card/60">
          <ul className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid size-10 place-items-center rounded-full bg-muted text-leaf">
                  <Icon className="size-5" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured mangoes */}
      <Section>
        <SectionHeading
          eyebrow="Seasonal Collection"
          title="Featured Devgad Alphonso"
          description="Boxes are packed to order during the season, from flowering in winter to the last harvest of the summer."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mangoes.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      {/* Why Devgad */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src={images.farm}
              alt="A farmer harvesting mangoes in a Konkan orchard"
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-5/4 w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">Why Devgad?</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              A stretch of coast that shapes the fruit
            </h2>
            <p className="mt-4 text-secondary-foreground/80">
              Devgad sits on a narrow belt of laterite soil between the Sahyadri hills and the Arabian Sea. Sea air,
              long sun and old trees give the fruit its character.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ["Devgad origin", "Fruit sourced from orchards in and around Devgad taluka."],
                ["Natural ripening", "Ripened in grass beds — never with artificial agents."],
                ["Saffron pulp", "Deep colour, fine fibre and a full aroma when cut."],
                ["Seasonal only", "Available through the harvest window, not all year."],
              ].map(([t, d]) => (
                <li key={t}>
                  <p className="font-serif text-lg">{t}</p>
                  <p className="mt-1 text-sm text-secondary-foreground/75">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Kokani products */}
      <Section>
        <SectionHeading
          eyebrow="From Konkan Kitchens"
          title="Authentic Kokani Products"
          description="Kokum, cashews, pickles, masalas and everyday coastal staples made by families we buy from directly."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kokani.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <section className="bg-muted/60">
        <div className="container-page py-20">
          <SectionHeading eyebrow="How It Works" title="From our orchard to your kitchen" />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="surface-card p-6">
                <span className="font-serif text-3xl text-primary">{s.n}</span>
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <Section>
        <SectionHeading eyebrow="Customer Reviews" title="What our customers say" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure key={r.name} className="surface-card flex h-full flex-col p-6">
              <Quote className="size-6 text-primary" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">{r.text}</blockquote>
              <figcaption className="mt-5">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}</p>
                <p className="mt-2 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-primary text-primary" aria-hidden />
                  ))}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Farms strip */}
      <section className="container-page">
        <div className="grid gap-4 sm:grid-cols-3">
          {[images.farm, images.hero, images.hero5].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={["Mango orchard in Konkan", "Harvested Alphonso mangoes", "Traditional Kokani products"][i]}
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-4/3 w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Section>
        <div className="surface-card overflow-hidden bg-[image:var(--gradient-sun)] p-10 text-center sm:p-14">
          <h2 className="text-3xl font-semibold text-secondary">Seasonal mango updates, first</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-secondary/80">
            Get harvest dates, new products and exclusive offers before the season opens.
          </p>
          <form
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-card"
            />
            <Button type="submit" variant="secondary">
              Subscribe <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
