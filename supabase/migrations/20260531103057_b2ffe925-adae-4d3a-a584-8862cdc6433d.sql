
DROP POLICY "Anyone can insert inquiries" ON public.inquiries;

CREATE POLICY "Public can submit valid inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    privacy_accepted = true
    AND length(trim(ime_priimek)) BETWEEN 2 AND 200
    AND length(trim(telefon)) BETWEEN 5 AND 50
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND array_length(services, 1) >= 1
  );

DROP POLICY "Anyone can upload inquiry files" ON storage.objects;

CREATE POLICY "Public can upload inquiry files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'inquiry-uploads'
    AND octet_length(COALESCE(name, '')) BETWEEN 1 AND 512
  );
