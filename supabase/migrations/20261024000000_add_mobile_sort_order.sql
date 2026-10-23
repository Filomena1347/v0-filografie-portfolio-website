-- Separate gallery ordering for mobile. media_items.sort_order remains the desktop order
-- and all_sort_order the desktop order of the "Vše" tab; these columns hold the mobile equivalents.
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS sort_order_mobile integer;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS all_sort_order_mobile integer;

UPDATE public.media_items SET sort_order_mobile = sort_order WHERE sort_order_mobile IS NULL;
UPDATE public.media_items
SET all_sort_order_mobile = all_sort_order
WHERE all_sort_order_mobile IS NULL AND all_sort_order IS NOT NULL;
