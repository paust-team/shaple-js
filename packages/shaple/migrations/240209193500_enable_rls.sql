ALTER TABLE storage.buckets
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY storage_buckets_policy ON storage.buckets FOR ALL TO anon, authenticated USING (true);
CREATE POLICY storage_objects_policy ON storage.objects FOR ALL TO authenticated USING (
    auth.uid() = owner
);