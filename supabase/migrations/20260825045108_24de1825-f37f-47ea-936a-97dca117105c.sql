-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  slug text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  mrp integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are public" ON public.products FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE DEFAULT 'KK-' || lpad((floor(random() * 900000) + 100000)::text, 6, '0'),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address1 text NOT NULL,
  address2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  delivery_method text NOT NULL DEFAULT 'standard',
  payment_method text NOT NULL DEFAULT 'upi',
  subtotal integer NOT NULL DEFAULT 0,
  shipping integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'placed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  variant text NOT NULL DEFAULT '',
  unit_price integer NOT NULL DEFAULT 0,
  qty integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

CREATE INDEX orders_user_id_idx ON public.orders (user_id);
CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);

INSERT INTO public.products (slug, name, category, price, mrp, stock, is_active) VALUES
  ('devgad-alphonso-mango-dozen','Devgad Alphonso Mango','devgad-mangoes',2150,2600,24,true),
  ('premium-devgad-hapus','Premium Devgad Hapus','devgad-mangoes',2750,3200,12,true),
  ('alphonso-family-box','Alphonso Mango Family Box','devgad-mangoes',3950,4600,8,true),
  ('alphonso-gift-box','Alphonso Mango Gift Box','devgad-mangoes',1650,1950,3,true),
  ('kokum-syrup','Kokum Syrup','kokum',390,450,40,true),
  ('kokum-agal','Kokum Agal','kokum',260,300,33,true),
  ('sol-kadhi-mix','Sol Kadhi Mix','kokum',180,220,5,true),
  ('devgad-cashews','Devgad Cashews (W240)','dry-fruits',890,1050,60,true),
  ('authentic-mango-pickle','Authentic Mango Pickle','pickles',320,380,27,true),
  ('kokani-masala','Kokani Masala','masalas',290,340,0,true),
  ('aam-papad','Alphonso Aam Papad','snacks',250,300,18,true),
  ('jackfruit-chips','Jackfruit Chips','snacks',190,230,22,true),
  ('cold-pressed-coconut-oil','Cold Pressed Coconut Oil','coconut',620,720,31,true)
ON CONFLICT (slug) DO NOTHING;