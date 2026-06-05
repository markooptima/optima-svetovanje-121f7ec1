
-- Restrict SELECT/UPDATE/DELETE on inquiries to service_role only
REVOKE SELECT, UPDATE, DELETE ON public.inquiries FROM anon, authenticated;

CREATE POLICY "Only service role can read inquiries"
ON public.inquiries FOR SELECT TO service_role USING (true);

CREATE POLICY "Only service role can update inquiries"
ON public.inquiries FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Only service role can delete inquiries"
ON public.inquiries FOR DELETE TO service_role USING (true);

-- Lock down inquiry-uploads storage bucket: only service_role can read/update/delete
CREATE POLICY "Only service role can read inquiry uploads"
ON storage.objects FOR SELECT TO service_role
USING (bucket_id = 'inquiry-uploads');

CREATE POLICY "Only service role can update inquiry uploads"
ON storage.objects FOR UPDATE TO service_role
USING (bucket_id = 'inquiry-uploads') WITH CHECK (bucket_id = 'inquiry-uploads');

CREATE POLICY "Only service role can delete inquiry uploads"
ON storage.objects FOR DELETE TO service_role
USING (bucket_id = 'inquiry-uploads');
