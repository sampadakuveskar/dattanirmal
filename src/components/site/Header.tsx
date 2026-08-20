import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Heart, User, Home, Store } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/devgad-mangoes", label: "Devgad Mangoes" },
  { to: "/kokani-products", label: "Kokani Products" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Konkan Kokani Farms home">
      <span className="grid size-10 place-items-center rounded-full bg-[image:var(--gradient-sun)] font-serif text-lg font-bold text-secondary-foreground">
        K
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-lg font-semibold">Konkan Kokani</span>
        <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
          Farm to Home
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { count, wishlist } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-secondary text-secondary-foreground">
        <p className="container-page py-2 text-center text-xs sm:text-sm">
          Fresh Devgad Alphonso Mangoes — Direct from Konkan Farms
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[17rem] p-6">
                <SheetTitle className="font-serif text-xl">Menu</SheetTitle>
                <nav className="mt-6 flex flex-col gap-1">
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      {n.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" asChild aria-label="Search products">
              <Link to="/shop">
                <Search />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Account" className="hidden sm:inline-flex">
              <Link to="/account">
                <User />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label={`Wishlist, ${wishlist.length} items`}>
              <Link to="/account" className="relative">
                <Heart />
                {wishlist.length > 0 && <Dot n={wishlist.length} />}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label={`Cart, ${count} items`}>
              <Link to="/cart" className="relative">
                <ShoppingBag />
                {count > 0 && <Dot n={count} />}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur md:hidden"
      >
        {[
          { to: "/", label: "Home", Icon: Home },
          { to: "/shop", label: "Shop", Icon: Store },
          { to: "/account", label: "Account", Icon: User },
          { to: "/cart", label: "Cart", Icon: ShoppingBag },
        ].map(({ to, label, Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium text-muted-foreground data-[status=active]:text-accent"
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid size-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-accent-foreground">
      {n}
    </span>
  );
}
