-- Run in Supabase SQL editor or via MCP execute_sql for project jrvahgupsifnchwwzflu

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'open-router-sessions',
  'open-router-sessions',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for avatar URLs
CREATE POLICY IF NOT EXISTS "Public read open-router-sessions"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'open-router-sessions');
