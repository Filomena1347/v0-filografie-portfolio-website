CREATE TABLE IF NOT EXISTS public.events_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('photo', 'video')),
  cloudinary_public_id text NOT NULL,
  url text NOT NULL,
  poster_url text,
  width integer,
  height integer,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_media_type_order_idx
  ON public.events_media (type, sort_order);

ALTER TABLE public.events_media ENABLE ROW LEVEL SECURITY;

-- Same rule as media_items: anyone can read, only an authenticated admin can write.
DROP POLICY IF EXISTS events_media_select_public ON public.events_media;
CREATE POLICY events_media_select_public ON public.events_media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS events_media_insert_authenticated ON public.events_media;
CREATE POLICY events_media_insert_authenticated ON public.events_media
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS events_media_update_authenticated ON public.events_media;
CREATE POLICY events_media_update_authenticated ON public.events_media
  FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS events_media_delete_authenticated ON public.events_media;
CREATE POLICY events_media_delete_authenticated ON public.events_media
  FOR DELETE USING (auth.uid() IS NOT NULL);
