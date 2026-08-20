import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";
import { Section } from "@/components/site/Section";
import { blogPosts, images } from "@/data/catalog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Konkan Journal — Mango Guides & Kokani Recipes | Konkan Kokani" },
      {
        name: "description",
        content:
          "Guides on identifying authentic Devgad Alphonso, storing mangoes, traditional Kokani recipes and life on Konkan farms.",
      },
      { property: "og:title", content: "Konkan Journal — Mango Guides & Kokani Recipes" },
      { property: "og:description", content: "Practical guides on Devgad Alphonso, Konkan food and farming." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes from the Konkan coast"
        description="Guides on choosing and storing Alphonso, traditional recipes, and stories from the farms we work with."
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <article key={post.slug} className="surface-card overflow-hidden">
              <img
                src={[images.hero, images.farm, images.kokani][i % 3]}
                alt=""
                loading="lazy"
                width={1400}
                height={1000}
                className="aspect-4/3 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">{post.category}</p>
                <h2 className="mt-2 font-serif text-xl">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
