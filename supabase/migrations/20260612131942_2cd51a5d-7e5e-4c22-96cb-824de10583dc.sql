
ALTER TABLE public.inquiries ALTER COLUMN email DROP NOT NULL;

DROP POLICY IF EXISTS "Public can submit valid inquiries" ON public.inquiries;

CREATE POLICY "Public can submit valid inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  privacy_accepted = true
  AND length(trim(ime_priimek)) BETWEEN 2 AND 200
  AND length(trim(telefon)) BETWEEN 5 AND 50
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND array_length(services, 1) >= 1
);
