import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-[image:var(--gradient-cream)]">
      <div className="container-page py-14 sm:py-20">
        {eyebrow && (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
