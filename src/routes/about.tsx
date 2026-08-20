import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";
import { Section, SectionHeading } from "@/components/site/Section";
import { images } from "@/data/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Our Konkan Roots | Konkan Kokani Farms" },
      {
        name: "description",
        content:
          "The story behind Konkan Kokani Farms: family orchards in Devgad, the farmers we buy from, and how we select and pack every order.",
      },
      { property: "og:title", content: "About Konkan Kokani Farms" },
      { property: "og:description", content: "Family orchards in Devgad, direct farmer sourcing, and careful packing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="From our Konkan roots to your home"
        description="What began as a family orchard near Devgad now works with growers across the coast to bring their fruit and food to households across India."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <img
            src={images.farm}
            alt="Mango orchard and farmer in Konkan"
            loading="lazy"
            width={1400}
            height={1000}
            className="aspect-4/3 w-full rounded-[2rem] object-cover"
          />
          <div className="space-y-4 text-muted-foreground">
            <h2 className="text-3xl font-semibold text-foreground">Growers first, always</h2>
            <p>
              Our family has tended mango trees in the Devgad belt for three generations. Selling directly meant we
              could pay growers fairly and keep the fruit in fewer hands between the tree and your table.
            </p>
            <p>
              Today we work with a small group of orchards and food makers we know personally. We visit before the
              season, agree on prices upfront, and pack every order ourselves.
            </p>
            <p>
              We describe our products plainly. If a batch is smaller, later or different from last year, we say so
              rather than promising more than the season allows.
            </p>
          </div>
        </div>
      </Section>

      <section className="bg-muted/60">
        <div className="container-page py-20">
          <SectionHeading eyebrow="Why Choose Us" title="What we hold ourselves to" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Authentic sourcing", "Bought directly from orchards and small makers we visit."],
              ["Quality products", "Sorted by hand; anything below grade never ships."],
              ["Farmer connection", "Prices agreed before the season, paid on time."],
              ["Hygienic packing", "Clean packing sheds and cushioned, food-safe cartons."],
              ["Reliable delivery", "Tracked shipping with support over WhatsApp."],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-6">
                <h3 className="font-serif text-lg">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
