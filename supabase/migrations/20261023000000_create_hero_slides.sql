CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cloudinary_public_id text NOT NULL,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  object_position text NOT NULL DEFAULT 'center center',
  alt_cs text,
  alt_en text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hero_slides_active_order_idx
  ON public.hero_slides (is_active, sort_order);

-- Seed only an empty table so re-running never duplicates or overwrites edited slides.
INSERT INTO public.hero_slides
  (cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en)
SELECT v.cloudinary_public_id, v.image_url, v.sort_order, v.object_position, v.alt_cs, v.alt_en
FROM (
  VALUES
    ('hero/hero-wedding',
     'https://res.cloudinary.com/duntvai9w/image/upload/hero/hero-wedding.jpg',
     0, '55% center',
     'Novomanželé se drží za ruce a procházejí se zahradou kolem fontány',
     'Newlyweds holding hands and walking through a garden past a fountain'),
    ('hero/hero-cocktail',
     'https://res.cloudinary.com/duntvai9w/image/upload/hero/hero-cocktail.jpg',
     1, 'center 40%',
     'Růžový koktejl s mátou na tmavém barovém pultu',
     'Pink cocktail garnished with mint on a dark bar counter'),
    ('hero/hero-prom',
     'https://res.cloudinary.com/duntvai9w/image/upload/hero/hero-prom.jpg',
     2, 'center top',
     'Portrét mladé ženy ve zlatých šatech se šerpou na plese',
     'Portrait of a young woman in a gold dress wearing a sash at a ball'),
    ('hero/hero-conference',
     'https://res.cloudinary.com/duntvai9w/image/upload/hero/hero-conference.jpg',
     3, '48% center',
     'Skupina usmívajících se účastníků konference s visačkami',
     'Group of smiling conference attendees wearing badges')
) AS v(cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en)
WHERE NOT EXISTS (SELECT 1 FROM public.hero_slides);
