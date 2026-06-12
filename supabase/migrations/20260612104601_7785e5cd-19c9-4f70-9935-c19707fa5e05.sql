
DROP POLICY IF EXISTS "Public can upload inquiry files" ON storage.objects;

CREATE POLICY "Public can upload inquiry files"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'inquiry-uploads'
  AND octet_length(COALESCE(name, '')) BETWEEN 1 AND 512
  AND lower(name) ~ '\.(jpg|jpeg|png|webp|heic|heif|pdf)$'
);
