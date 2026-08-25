import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const statusSchema = z.enum([
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const [{ data: products }, { data: orders }] = await Promise.all([
      supabase.from("products").select("*").order("category"),
      supabase
        .from("orders")
        .select("id, order_number, full_name, email, city, status, total, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const revenue = (orders ?? []).reduce((n, o) => n + (o.status === "cancelled" ? 0 : o.total), 0);

    return {
      products: products ?? [],
      orders: orders ?? [],
      stats: {
        orders: orders?.length ?? 0,
        revenue,
        lowStock: (products ?? []).filter((p) => p.stock <= 5).length,
        products: products?.length ?? 0,
      },
    };
  });

export const updateProductAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        price: z.number().int().min(0).max(1000000),
        stock: z.number().int().min(0).max(100000),
        isActive: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("products")
      .update({ price: data.price, stock: data.stock, is_active: data.isActive })
      .eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: statusSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
