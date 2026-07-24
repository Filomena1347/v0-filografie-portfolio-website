-- ============================================================
-- Filomena CMS — run this once in Supabase SQL Editor
-- ============================================================

-- 1. media_items table
CREATE TABLE IF NOT EXISTS public.media_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL CHECK (type IN ('video', 'photo')),
  title         TEXT,
  src           TEXT NOT NULL,
  thumbnail_url TEXT,
  category      TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.media_items;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.media_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Row Level Security
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Public visitors can only read published items
DROP POLICY IF EXISTS "public_read_published" ON public.media_items;
CREATE POLICY "public_read_published"
  ON public.media_items FOR SELECT
  USING (published = true);

-- Authenticated admin can do everything
DROP POLICY IF EXISTS "admin_all" ON public.media_items;
CREATE POLICY "admin_all"
  ON public.media_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Storage bucket for videos and thumbnails
-- Go to Storage > New bucket > name: "media" > Public: ON
-- (Cannot be done via SQL — create it in the Supabase dashboard Storage tab)
