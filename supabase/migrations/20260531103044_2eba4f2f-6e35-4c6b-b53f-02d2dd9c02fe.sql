
-- Inquiries table for public form submissions
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  ime_priimek text NOT NULL,
  podjetje text,
  naslov text,
  posta_kraj text,
  telefon text NOT NULL,
  email text NOT NULL,
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

GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public lead-gen form)
CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public SELECT — inquiries are private to staff (accessed via service_role)

-- Storage bucket for uploaded bills/contracts (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-uploads', 'inquiry-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload files to this bucket (for the public form)
CREATE POLICY "Anyone can upload inquiry files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'inquiry-uploads');
