import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";
import { Section, SectionHeading } from "@/components/site/Section";
import { images } from "@/data/catalog";

export const Route = createFileRoute("/farms")({
  head: () => ({
    meta: [
      { title: "Our Farms in Devgad, Konkan | Konkan Kokani Farms" },
      {
        name: "description",
        content:
          "See where the fruit comes from: mango orchards around Devgad, the harvest, sorting and packing before your order ships.",
      },
      { property: "og:title", content: "Our Farms in Devgad, Konkan" },
      { property: "og:description", content: "Orchards, harvest, sorting and packing across the Konkan coast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Farms,
});

const journey = [
  ["Farm", "Orchards on laterite slopes between the Sahyadris and the sea."],
  ["Harvest", "Fruit picked by hand with harvesting nets, never shaken loose."],
  ["Sorting", "Graded by size and inspected for blemishes and sap marks."],
  ["Packing", "Grass-bed ripening, then cushioned cartons packed to order."],
  ["Delivery", "Dispatched with tracking shared by WhatsApp and email."],
];

function Farms() {
  return (
    <>
      <PageHero
        eyebrow="Our Farms"
        title="Where the fruit actually comes from"
        description="A short walk through the orchards, sheds and hands your order passes through."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {[images.farm, images.hero, images.kokani].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={["Konkan mango orchard", "Harvested Alphonso mangoes", "Packed Kokani products"][i]}
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-4/3 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="The Journey" title="Farm to delivery" />
        <ol className="mt-12 grid gap-5 md:grid-cols-5">
          {journey.map(([t, d], i) => (
            <li key={t} className="surface-card p-6">
              <span className="font-serif text-2xl text-primary">{i + 1}</span>
              <h3 className="mt-2 text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
