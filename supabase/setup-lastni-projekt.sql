-- =====================================================================
-- Optima Svetovanje — enkratna namestitev v LASTEN Supabase projekt
-- Zaženi celotno vsebino v Supabase → SQL Editor → Run.
-- Skripta je varna za ponovni zagon (idempotentna).
-- =====================================================================

-- 1) Tabela povpraševanj -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  ime_priimek text NOT NULL,
  podjetje text,
  naslov text,
  posta_kraj text,
  telefon text NOT NULL,
  email text,
  services text[] NOT NULL DEFAULT '{}',
  elektrika_dobavitelj text,
  elektrika_znesek numeric,
  plin_dobavitelj text,
  plin_znesek numeric,
  telco_operater text,
  telco_znesek numeric,
  telco_paketi text[] DEFAULT '{}',
  dodatne_informacije text,
  file_paths text[] DEFAULT '{}',
  privacy_accepted boolean NOT NULL DEFAULT false
);

ALTER TABLE public.inquiries ALTER COLUMN email DROP NOT NULL;

-- 2) Pravice (brez teh PostgREST vrne "permission denied") -------------
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
REVOKE SELECT, UPDATE, DELETE ON public.inquiries FROM anon, authenticated;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 3) RLS politike ------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit valid inquiries" ON public.inquiries;
CREATE POLICY "Public can submit valid inquiries"
ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  privacy_accepted = true
  AND length(trim(ime_priimek)) BETWEEN 2 AND 200
  AND length(trim(telefon)) BETWEEN 5 AND 50
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND array_length(services, 1) >= 1
);

DROP POLICY IF EXISTS "Only service role can read inquiries" ON public.inquiries;
CREATE POLICY "Only service role can read inquiries"
ON public.inquiries FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Only service role can update inquiries" ON public.inquiries;
CREATE POLICY "Only service role can update inquiries"
ON public.inquiries FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Only service role can delete inquiries" ON public.inquiries;
CREATE POLICY "Only service role can delete inquiries"
ON public.inquiries FOR DELETE TO service_role USING (true);

-- 4) Storage bucket za priponke (zaseben) ------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-uploads', 'inquiry-uploads', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can upload inquiry files" ON storage.objects;
CREATE POLICY "Public can upload inquiry files"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'inquiry-uploads'
  AND octet_length(COALESCE(name, '')) BETWEEN 1 AND 512
  AND lower(name) ~ '\.(jpg|jpeg|png|webp|heic|heif|pdf)$'
);

DROP POLICY IF EXISTS "Only service role can read inquiry uploads" ON storage.objects;
CREATE POLICY "Only service role can read inquiry uploads"
ON storage.objects FOR SELECT TO service_role
USING (bucket_id = 'inquiry-uploads');

DROP POLICY IF EXISTS "Only service role can update inquiry uploads" ON storage.objects;
CREATE POLICY "Only service role can update inquiry uploads"
ON storage.objects FOR UPDATE TO service_role
USING (bucket_id = 'inquiry-uploads') WITH CHECK (bucket_id = 'inquiry-uploads');

DROP POLICY IF EXISTS "Only service role can delete inquiry uploads" ON storage.objects;
CREATE POLICY "Only service role can delete inquiry uploads"
ON storage.objects FOR DELETE TO service_role
USING (bucket_id = 'inquiry-uploads');
