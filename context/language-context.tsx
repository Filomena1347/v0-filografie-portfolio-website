"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Lang = "cs" | "en"

type Dict = {
  nav_work: string
  nav_about: string
  hero_filter_weddings: string
  hero_filter_graphics: string
  hero_card_weddings_cat: string
  hero_card_weddings_desc: string
  hero_card_graphics_cat: string
  hero_card_graphics_desc: string
  photo_cat_weddings: string
  about_label: string
  about_title: string
  about_bio: string
  about_photo_placeholder: string
  gallery_empty: string
  gallery_close: string
  gallery_items: string

  nav_photography: string
  nav_video: string
  nav_content: string
  nav_contact: string
  nav_cta: string

  hero_label: string
  hero_title: string
  hero_tag_photo: string
  hero_tag_video: string
  hero_tag_content: string
  hero_scroll: string

  hero_filter_all: string
  hero_filter_photo: string
  hero_filter_video: string
  hero_filter_gastro: string
  hero_filter_events: string
  hero_filter_ugc: string

  hero_card_events_cat: string
  hero_card_events_desc: string
  hero_card_gastro_cat: string
  hero_card_gastro_desc: string
  hero_card_video_cat: string
  hero_card_video_desc: string
  hero_card_ugc_cat: string
  hero_card_ugc_desc: string
  hero_card_portraits_cat: string
  hero_card_portraits_desc: string

  pillars_label: string
  pillar_photo_title: string
  pillar_photo_desc: string
  pillar_video_title: string
  pillar_video_desc: string
  pillar_content_title: string
  pillar_content_desc: string

  photo_label: string
  photo_title: string
  photo_cat_events: string
  photo_cat_gastro: string
  photo_cat_portraits: string
  photo_view_all: string
  photo_view_less: string
  photo_empty: string

  video_label: string
  video_title: string
  video_sub: string
  video_empty: string

  content_label: string
  content_title: string
  content_desc: string
  content_empty: string

  contact_label: string
  contact_title: string
  contact_desc: string
  contact_name: string
  contact_email: string
  contact_message: string
  contact_send: string
  contact_sending: string
  contact_success: string
  contact_error: string

  footer_tagline: string
  footer_rights: string
}

const translations: Record<Lang, Dict> = {
  cs: {
    nav_work: "Práce",
    nav_about: "O mně",
    hero_filter_weddings: "Svatby",
    hero_filter_graphics: "Grafika",
    hero_card_weddings_cat: "Svatby",
    hero_card_weddings_desc: "Svatební den od příprav po první tanec",
    hero_card_graphics_cat: "Grafika",
    hero_card_graphics_desc: "Vizuální identita & příspěvky",
    photo_cat_weddings: "Svatby",
    about_label: "O mně",
    about_title: "Zdravím! Jsem Filoména — ten človíček za foťákem 😊",
    about_bio:
      "Věnuju se fotografii, videu, grafice a sociálním sítím. Fotím vše od svateb a koncertů přes konference až po portréty. Specializuju se na reportážní fotografii — takže hotový materiál dostanete ještě ten samý den, připravený rovnou ke sdílení.\n\nJsem takový chodící šnek — nikdy bez batohu plného foťáku, notebooku a všeho potřebného. A protože miluju cestování, klidně za vámi dorazím kamkoliv po světě 🌍",
    about_photo_placeholder: "Fotka bude brzy doplněna",
    gallery_empty: "Zatím žádná média",
    gallery_close: "Zavřít ↑",
    gallery_items: "položek",

    nav_photography: "Fotografie",
    nav_video: "Video",
    nav_content: "Obsah",
    nav_contact: "Kontakt",
    nav_cta: "Spojme se",

    hero_label: "Tvorba od Filomény",
    hero_title: "Vizuální vyprávění příběhů.",
    hero_tag_photo: "Foto",
    hero_tag_video: "Video",
    hero_tag_content: "Obsah",
    hero_scroll: "Posunout dolů",

    hero_filter_all: "Vše",
    hero_filter_photo: "Fotografie",
    hero_filter_video: "Video",
    hero_filter_gastro: "Gastro",
    hero_filter_events: "Eventy",
    hero_filter_ugc: "UGC",

    hero_card_events_cat: "Eventy",
    hero_card_events_desc: "Firemní akce & oslavy",
    hero_card_gastro_cat: "Gastro",
    hero_card_gastro_desc: "Food styling & restaurace",
    hero_card_video_cat: "Video",
    hero_card_video_desc: "Reels & brandový obsah",
    hero_card_ugc_cat: "UGC",
    hero_card_ugc_desc: "Autentický obsah pro značky",
    hero_card_portraits_cat: "Fotografie",
    hero_card_portraits_desc: "Portréty & lifestyle",

    pillars_label: "Co tvořím",
    pillar_photo_title: "Fotografie",
    pillar_photo_desc: "Eventy & Gastro",
    pillar_video_title: "Video",
    pillar_video_desc: "Reels & Brandový obsah",
    pillar_content_title: "Obsah",
    pillar_content_desc: "Sociální sítě & UGC",

    photo_label: "Portfolio",
    photo_title: "Fotografie",
    photo_cat_events: "Eventy",
    photo_cat_gastro: "Gastro",
    photo_cat_portraits: "Portréty",
    photo_view_all: "Zobrazit vše",
    photo_view_less: "Zobrazit méně",
    photo_empty: "Fotografie budou brzy doplněny.",

    video_label: "Pohyblivý obraz",
    video_title: "Video",
    video_sub: "UGC & Brandový obsah",
    video_empty: "Videa budou brzy doplněna.",

    content_label: "Sociální sítě",
    content_title: "Obsah & Reels",
    content_desc: "Správa sociálních sítí, reels a uživatelsky generovaný obsah pro značky.",
    content_empty: "Obsah bude brzy doplněn.",

    contact_label: "Kontakt",
    contact_title: "Spojme se",
    contact_desc: "Máte projekt na mysli? Napište mi a společně vytvoříme něco výjimečného.",
    contact_name: "Jméno",
    contact_email: "E-mail",
    contact_message: "Zpráva",
    contact_send: "Odeslat zprávu",
    contact_sending: "Odesílám…",
    contact_success: "Děkuji! Ozvu se co nejdříve.",
    contact_error: "Něco se pokazilo. Zkuste to prosím znovu.",

    footer_tagline: "Vizuální vyprávění příběhů — foto, video, obsah.",
    footer_rights: "Všechna práva vyhrazena.",
  },
  en: {
    nav_work: "Work",
    nav_about: "About",
    hero_filter_weddings: "Weddings",
    hero_filter_graphics: "Graphics",
    hero_card_weddings_cat: "Weddings",
    hero_card_weddings_desc: "From getting ready to the first dance",
    hero_card_graphics_cat: "Graphics",
    hero_card_graphics_desc: "Visual identity & social posts",
    photo_cat_weddings: "Weddings",
    about_label: "About",
    about_title: "Hi, I’m Filoména — the person behind the camera 😊",
    about_bio:
      "I work in photography, video, graphic design and social media. I shoot everything from weddings and concerts to conferences and portraits. My specialty is reportage photography — which means you get polished, ready-to-post content the very same day.\n\nI’m basically a walking snail — never without my backpack packed with a camera, laptop and everything I need. And since I love to travel, I’m happy to come to you wherever you are in the world 🌍",
    about_photo_placeholder: "Photo coming soon",
    gallery_empty: "No media yet",
    gallery_close: "Close ↑",
    gallery_items: "items",

    nav_photography: "Photography",
    nav_video: "Video",
    nav_content: "Content",
    nav_contact: "Contact",
    nav_cta: "Get in touch",

    hero_label: "Creative by Filoména",
    hero_title: "Visual storytelling.",
    hero_tag_photo: "Photo",
    hero_tag_video: "Video",
    hero_tag_content: "Content",
    hero_scroll: "Scroll down",

    hero_filter_all: "All",
    hero_filter_photo: "Photography",
    hero_filter_video: "Video",
    hero_filter_gastro: "Gastro",
    hero_filter_events: "Events",
    hero_filter_ugc: "UGC",

    hero_card_events_cat: "Events",
    hero_card_events_desc: "Corporate events & celebrations",
    hero_card_gastro_cat: "Gastro",
    hero_card_gastro_desc: "Food styling & restaurants",
    hero_card_video_cat: "Video",
    hero_card_video_desc: "Reels & brand content",
    hero_card_ugc_cat: "UGC",
    hero_card_ugc_desc: "Authentic content for brands",
    hero_card_portraits_cat: "Photography",
    hero_card_portraits_desc: "Portraits & lifestyle",

    pillars_label: "What I create",
    pillar_photo_title: "Photography",
    pillar_photo_desc: "Events & Gastro",
    pillar_video_title: "Video",
    pillar_video_desc: "Reels & Brand Content",
    pillar_content_title: "Content",
    pillar_content_desc: "Social Media & UGC",

    photo_label: "Portfolio",
    photo_title: "Photography",
    photo_cat_events: "Events",
    photo_cat_gastro: "Gastro",
    photo_cat_portraits: "Portraits",
    photo_view_all: "View all",
    photo_view_less: "View less",
    photo_empty: "Photos coming soon.",

    video_label: "Motion",
    video_title: "Video",
    video_sub: "UGC & Brand Content",
    video_empty: "Videos coming soon.",

    content_label: "Social Media",
    content_title: "Content & Reels",
    content_desc: "Social media management, reels and user-generated content for brands.",
    content_empty: "Content coming soon.",

    contact_label: "Contact",
    contact_title: "Let's connect",
    contact_desc: "Have a project in mind? Reach out and let's create something remarkable together.",
    contact_name: "Name",
    contact_email: "Email",
    contact_message: "Message",
    contact_send: "Send message",
    contact_sending: "Sending…",
    contact_success: "Thank you! I'll be in touch soon.",
    contact_error: "Something went wrong. Please try again.",

    footer_tagline: "Visual storytelling — photo, video, content.",
    footer_rights: "All rights reserved.",
  },
}

type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: Dict
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode
  initialLang?: Lang
}) {
  const [lang, setLang] = useState<Lang>(initialLang)

  const toggle = useCallback(() => {
    const next: Lang = lang === "cs" ? "en" : "cs"
    setLang(next)
    // Only the public site has language URLs; replaceState keeps the Back button from trapping visitors.
    const { pathname, search, hash } = window.location
    if (/^\/(cs|en)?\/?$/.test(pathname)) {
      window.history.replaceState(window.history.state, "", `${next === "cs" ? "/cs" : "/"}${search}${hash}`)
    }
  }, [lang])
  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
