import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MessageCircle } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      { to: "/shop", label: "All Products" },
      { to: "/devgad-mangoes", label: "Devgad Mangoes" },
      { to: "/kokani-products", label: "Kokani Products" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/farms", label: "Our Farms" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/contact", label: "Shipping Policy" },
      { to: "/contact", label: "Refund Policy" },
      { to: "/contact", label: "Privacy Policy" },
      { to: "/contact", label: "Terms & Conditions" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">DattaNirmal</p>
          <p className="mt-3 max-w-xs text-sm text-secondary-foreground/75">
            Devgad Alphonso mangoes and traditional Kokani products, sourced directly from farms across coastal
            Maharashtra.
          </p>
          <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com/_datta_nirmal_/" aria-label="Instagram" className="rounded-full border border-secondary-foreground/25 p-2.5 transition-colors hover:bg-secondary-foreground/10">
              <Instagram className="size-4" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full border border-secondary-foreground/25 p-2.5 transition-colors hover:bg-secondary-foreground/10">
              <Facebook className="size-4" />
            </a>
            <a href="https://wa.me/919284821855" aria-label="WhatsApp" className="rounded-full border border-secondary-foreground/25 p-2.5 transition-colors hover:bg-secondary-foreground/10">
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>

        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="font-serif text-base">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-secondary-foreground/75">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors hover:text-secondary-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

    <div className="border-t border-secondary-foreground/15">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-secondary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DattaNirmal Farms. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-4">
            <a href="tel:+919000000000" className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" /> +91 9284821855
            </a>
            <a href="mailto:shubhamprabhu5909@gmail.com" className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> shubhamprabhu5909@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
