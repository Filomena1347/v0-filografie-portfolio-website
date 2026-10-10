import type { CategoryKey, MediaItem } from "@/lib/media"

function seed(category: CategoryKey, count: number, alt: string[]): MediaItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `seed-${category}-${i + 1}`,
    type: "photo",
    section: "gallery",
    category,
    title: alt[i] ?? null,
    public_id: `seed/${category}-${i + 1}`,
    url: `/images/gallery/${category}-${i + 1}.png`,
    thumbnail_url: null,
    width: null,
    height: null,
    sort_order: 1000 + i,
    published: true,
    created_at: "2026-01-01T00:00:00.000Z",
  }))
}

/** Bundled portfolio photos shown alongside anything uploaded through the admin panel. */
export const SEED_GALLERIES: Partial<Record<CategoryKey, MediaItem[]>> = {
  events: seed("events", 4, [
    "Houslistka na pódiu",
    "Zpěvačka s kytarou na večerním koncertu",
    "Šéfkuchařka na oslavě v restauraci",
    "Make-up v zákulisí natáčení",
  ]),
  gastro: seed("gastro", 13, [
    "Vafle s čerstvým ovocem",
    "Knedlíčky gyoza s hůlkami",
    "Koktejl v kupé sklenici",
    "Ramen s vejcem a kuřetem",
    "Přípitek s pivem Corona",
    "Ovocný koktejl s květinou",
    "Láhev whisky Radlík",
    "Sushi Corso",
    "Šéfkuchařka při servírování",
    "Ledové limonády",
    "Korejské kuře",
    "Frozen daiquiri",
    "Čepování piva Hoegaarden",
  ]),
}
