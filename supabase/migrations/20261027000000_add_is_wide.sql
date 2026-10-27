-- Marks a gallery item as "wide": on tablet/desktop it spans 2 grid columns instead of 1.
ALTER TABLE public.media_items
  ADD COLUMN IF NOT EXISTS is_wide boolean NOT NULL DEFAULT false;
