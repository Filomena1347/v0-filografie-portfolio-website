-- Independent visibility flag for the homepage "Vše" tab.
-- A photo keeps its main category; this flag only controls whether it also appears in "Vše".
ALTER TABLE public.media_items
  ADD COLUMN IF NOT EXISTS show_in_vse boolean NOT NULL DEFAULT true;
