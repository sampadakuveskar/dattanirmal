import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const orderSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(20),
  address1: z.string().min(3).max(200),
  address2: z.string().max(200).optional().default(""),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().min(4).max(10),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["upi", "card", "netbanking", "cod"]),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(120),
        name: z.string().min(1).max(160),
        variant: z.string().max(80).default(""),
        price: z.number().int().min(0).max(1000000),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const subtotal = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const shipping = data.deliveryMethod === "express" ? 350 : subtotal > 2500 ? 0 : 120;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        address1: data.address1,
        address2: data.address2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        delivery_method: data.deliveryMethod,
        payment_method: data.paymentMethod,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: "placed",
      })
      .select("id, order_number, total")
      .single();

    if (error || !order) throw new Error(error?.message ?? "Could not create order");

    const { error: itemsError } = await supabase.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        product_slug: i.slug,
        product_name: i.name,
        variant: i.variant,
        unit_price: i.price,
        qty: i.qty,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    return { orderNumber: order.order_number, total: order.total };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, status, total, created_at, order_items(product_name, variant, qty, unit_price)")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", context.userId)
      .maybeSingle();
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { profile: data ?? null, isAdmin: Boolean(isAdmin), email: context.claims?.email ?? null };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ fullName: z.string().max(120), phone: z.string().max(20) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, full_name: data.fullName, phone: data.phone });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
