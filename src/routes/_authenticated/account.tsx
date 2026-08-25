import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageShell";
import { useCart } from "@/lib/cart";
import { getProduct, inr } from "@/data/catalog";
import { getMyProfile, listMyOrders, updateMyProfile } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account & Orders | Konkan Kokani Farms" },
      {
        name: "description",
        content: "Track your Devgad Alphonso orders, update your profile and view your wishlist.",
      },
      { property: "og:title", content: "My Account | Konkan Kokani Farms" },
      { property: "og:description", content: "Track orders, update your profile and view your wishlist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

const timeline = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"] as const;
const timelineLabels: Record<string, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function Account() {
  const { wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchOrders = useServerFn(listMyOrders);
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);

  const orders = useQuery({ queryKey: ["my-orders"], queryFn: () => fetchOrders() });
  const profile = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile.data?.profile) {
      setFullName(profile.data.profile.full_name ?? "");
      setPhone(profile.data.profile.phone ?? "");
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () => saveProfile({ data: { fullName, phone } }),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => toast.error("Could not update profile"),
  });

  async function logout() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/" });
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Namaskar, welcome back"
        description={profile.data?.email ?? "Your orders, profile and saved items."}
      />
      <div className="container-page py-12">
        {profile.data?.isAdmin && (
          <div className="surface-card mb-8 flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm font-medium">You have admin access to this store.</p>
            <Button asChild size="sm">
              <Link to="/admin">Open admin panel</Link>
            </Button>
          </div>
        )}

        <Tabs defaultValue="orders">
          <TabsList className="flex-wrap">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-5 py-8">
            {orders.isLoading && <p className="text-sm text-muted-foreground">Loading your orders…</p>}
            {orders.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No orders yet.{" "}
                <Link to="/shop" className="text-accent underline">
                  Start shopping
                </Link>
                .
              </p>
            )}
            {orders.data?.map((o) => (
              <div key={o.id} className="surface-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Order #{o.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {o.order_items.map((i) => `${i.qty} × ${i.product_name}`).join(", ")} · {inr(o.total)}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {timelineLabels[o.status] ?? o.status}
                  </span>
                </div>
                {o.status !== "cancelled" && (
                  <ol className="mt-6 grid gap-3 sm:grid-cols-6">
                    {timeline.map((t, i) => {
                      const reached = timeline.indexOf(o.status as (typeof timeline)[number]) >= i;
                      return (
                        <li key={t} className="text-xs">
                          <span
                            className={`grid size-7 place-items-center rounded-full ${
                              reached
                                ? "bg-[image:var(--gradient-sun)] text-secondary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {reached ? <Check className="size-3.5" aria-hidden /> : i + 1}
                          </span>
                          <span className="mt-2 block">{timelineLabels[t]}</span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="wishlist" className="py-8">
            {wishlist.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing saved yet.{" "}
                <Link to="/shop" className="text-accent underline">
                  Browse products
                </Link>
                .
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {wishlist.map((slug) => {
                  const p = getProduct(slug);
                  if (!p) return null;
                  return (
                    <li key={slug} className="surface-card flex items-center gap-4 p-4">
                      <img src={p.image} alt={p.name} loading="lazy" width={120} height={120} className="size-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <Link to="/product/$slug" params={{ slug }} className="font-medium hover:text-accent">
                          {p.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{inr(p.price)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleWishlist(slug)}>
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="profile" className="py-8">
            <div className="surface-card max-w-md space-y-4 p-6">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
              </div>
              <p className="text-sm text-muted-foreground">{profile.data?.email}</p>
              <div className="flex gap-2 pt-1">
                <Button onClick={() => save.mutate()} disabled={save.isPending}>
                  Save changes
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
