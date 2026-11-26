CREATE TABLE public.seasonal_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  expected_month text NOT NULL DEFAULT 'To be announced',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seasonal_announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.seasonal_announcements TO authenticated;
GRANT ALL ON public.seasonal_announcements TO service_role;

ALTER TABLE public.seasonal_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published seasonal announcements are public"
ON public.seasonal_announcements
FOR SELECT TO anon, authenticated
USING (is_published);

CREATE POLICY "Admins can view all seasonal announcements"
ON public.seasonal_announcements
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage seasonal announcements"
ON public.seasonal_announcements
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX seasonal_announcements_public_created_idx
ON public.seasonal_announcements (is_published, created_at DESC);

CREATE TRIGGER seasonal_announcements_updated_at
BEFORE UPDATE ON public.seasonal_announcements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();