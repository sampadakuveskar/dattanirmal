import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { inr, stockLabel, type Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, wishlist } = useCart();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const stock = stockLabel(product.stock);
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group surface-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={600}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-semibold text-accent-foreground">
            {off}% off
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 shadow-[var(--shadow-soft)] transition-colors hover:bg-card"
        >
          <Heart className={cn("size-4", wished && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          {product.category.replace(/-/g, " ")}
        </p>
        <h3 className="font-serif text-lg leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            <Star className="size-3.5 fill-primary text-primary" aria-hidden />
            {product.rating}
          </span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
          <span
            className={cn(
              "ml-auto text-xs font-medium",
              stock === "In Stock" && "text-leaf",
              stock === "Low Stock" && "text-accent",
              stock === "Out of Stock" && "text-destructive",
            )}
          >
            {stock}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{product.weight}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
            )}
          </p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={product.stock === 0}
            onClick={() => {
              add({
                slug: product.slug,
                name: product.name,
                variant: product.variants[0]!.label,
                price: product.price,
                image: product.image,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            Add to Cart
          </Button>
          <Button asChild disabled={product.stock === 0}>
            <Link to="/product/$slug" params={{ slug: product.slug }}>
              Buy Now
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
