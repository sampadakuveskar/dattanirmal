import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminDashboard, updateOrderStatus, updateProductAdmin } from "@/lib/admin.functions";
import { listEnquiries, updateEnquiryStatus } from "@/lib/enquiries.functions";
import { inr } from "@/data/catalog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Konkan Kokani Farms" },
      { name: "description", content: "Manage products, inventory and orders for Konkan Kokani Farms." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const statuses = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

const statusLabels: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type ProductEdit = { price: number; stock: number; isActive: boolean };

function Admin() {
  const queryClient = useQueryClient();
  const fetchDashboard = useServerFn(getAdminDashboard);
  const saveProduct = useServerFn(updateProductAdmin);
  const saveStatus = useServerFn(updateOrderStatus);

  const fetchEnquiries = useServerFn(listEnquiries);
  const saveEnquiryStatus = useServerFn(updateEnquiryStatus);

  const dash = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => fetchDashboard(), retry: false });
  const leads = useQuery({ queryKey: ["admin-enquiries"], queryFn: () => fetchEnquiries(), retry: false });

  const leadMutation = useMutation({
    mutationFn: (input: { id: string; status: "new" | "contacted" | "closed" }) =>
      saveEnquiryStatus({ data: input }),
    onSuccess: () => {
      toast.success("Enquiry updated");
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: () => toast.error("Could not update enquiry"),
  });
  const [edits, setEdits] = useState<Record<string, ProductEdit>>({});

  const productMutation = useMutation({
    mutationFn: (input: { slug: string } & ProductEdit) => saveProduct({ data: input }),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: () => toast.error("Could not update product"),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: (typeof statuses)[number] }) => saveStatus({ data: input }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: () => toast.error("Could not update order"),
  });

  if (dash.isError) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Admin Panel" />
        <div className="container-page py-16">
          <div className="surface-card mx-auto max-w-md p-8 text-center">
            <ShieldAlert className="mx-auto size-10 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 font-serif text-2xl">No admin access</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This account doesn't have admin permissions. Ask the store owner to grant you the admin role.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/account">Back to my account</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const stats = dash.data?.stats;

  return (
    <>
      <PageHero eyebrow="Admin" title="Store control room" description="Inventory, pricing and order fulfilment." />
      <div className="container-page py-12">
        {dash.isLoading && <p className="text-sm text-muted-foreground">Loading dashboard…</p>}

        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Revenue", inr(stats.revenue)],
              ["Orders", String(stats.orders)],
              ["Products", String(stats.products)],
              ["Low stock (≤5)", String(stats.lowStock)],
            ].map(([label, value]) => (
              <div key={label} className="surface-card p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <Tabs defaultValue="orders" className="mt-10">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products & Stock</TabsTrigger>
            <TabsTrigger value="leads">Leads / Enquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="py-6">
            <div className="surface-card overflow-x-auto">
              <table className="w-full min-w-[44rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="p-4">Order</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.data?.orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/60 last:border-0">
                      <td className="p-4 font-medium">#{o.order_number}</td>
                      <td className="p-4">
                        <span className="block">{o.full_name}</span>
                        <span className="block text-xs text-muted-foreground">{o.email}</span>
                      </td>
                      <td className="p-4">{o.city}</td>
                      <td className="p-4">{inr(o.total)}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="p-4">
                        <Select
                          value={o.status}
                          onValueChange={(v) =>
                            statusMutation.mutate({ id: o.id, status: v as (typeof statuses)[number] })
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {statusLabels[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                  {dash.data?.orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="products" className="py-6">
            <div className="space-y-3">
              {dash.data?.products.map((p) => {
                const edit = edits[p.slug] ?? { price: p.price, stock: p.stock, isActive: p.is_active };
                const dirty =
                  edit.price !== p.price || edit.stock !== p.stock || edit.isActive !== p.is_active;
                const setEdit = (patch: Partial<ProductEdit>) =>
                  setEdits((prev) => ({ ...prev, [p.slug]: { ...edit, ...patch } }));
                return (
                  <div key={p.slug} className="surface-card flex flex-wrap items-center gap-4 p-4">
                    <div className="min-w-48 flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.category} · MRP {inr(p.mrp)}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      Price ₹
                      <Input
                        type="number"
                        min={0}
                        value={edit.price}
                        onChange={(e) => setEdit({ price: Number(e.target.value) || 0 })}
                        className="w-24"
                        aria-label={`Price for ${p.name}`}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      Stock
                      <Input
                        type="number"
                        min={0}
                        value={edit.stock}
                        onChange={(e) => setEdit({ stock: Number(e.target.value) || 0 })}
                        className="w-20"
                        aria-label={`Stock for ${p.name}`}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      Live
                      <Switch
                        checked={edit.isActive}
                        onCheckedChange={(v) => setEdit({ isActive: v })}
                        aria-label={`Visibility for ${p.name}`}
                      />
                    </label>
                    <Button
                      size="sm"
                      disabled={!dirty || productMutation.isPending}
                      onClick={() => productMutation.mutate({ slug: p.slug, ...edit })}
                    >
                      Save
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="leads" className="py-6">
            {leads.isLoading && <p className="text-sm text-muted-foreground">Loading enquiries…</p>}
            <div className="space-y-3">
              {leads.data?.map((l) => (
                <div key={l.id} className="surface-card flex flex-wrap items-start gap-4 p-4">
                  <div className="min-w-56 flex-1">
                    <p className="font-medium">
                      {l.name} · <span className="text-sm font-normal text-muted-foreground">{l.subject}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <a href={`mailto:${l.email}`} className="hover:text-accent">
                        {l.email}
                      </a>
                      {l.phone ? ` · ${l.phone}` : ""} ·{" "}
                      {new Date(l.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm">{l.message}</p>
                  </div>
                  <Select
                    value={l.status}
                    onValueChange={(v) =>
                      leadMutation.mutate({ id: l.id, status: v as "new" | "contacted" | "closed" })
                    }
                  >
                    <SelectTrigger className="w-36" aria-label={`Status for enquiry from ${l.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {leads.data?.length === 0 && (
                <p className="p-8 text-center text-muted-foreground">No enquiries yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
