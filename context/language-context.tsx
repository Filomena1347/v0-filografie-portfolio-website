"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "CZ";

interface Translations {
  // Navbar
  nav_work: string;
  nav_photography: string;
  nav_video: string;
  nav_digital: string;
  nav_pricing: string;
  nav_journal: string;
  nav_contact: string;
  nav_cta: string;
  nav_corporate: string;
  nav_weddings: string;
  nav_fashion: string;

  // Hero
  hero_line1: string;
  hero_line2: string;
  hero_subtitle: string;
  hero_scroll: string;
  hero_scroll_reels: string;

  // About
  about_label: string;
  about_heading1: string;
  about_heading2: string;
  about_p1: string;
  about_p2: string;
  about_photography: string;
  about_videography: string;
  about_digital_art: string;

  // Portfolio
  portfolio_label: string;
  portfolio_line1: string;
  portfolio_line2: string;
  portfolio_photography: string;
  portfolio_photography_desc: string;
  portfolio_social: string;
  portfolio_social_desc: string;
  portfolio_video: string;
  portfolio_video_desc: string;
  portfolio_graphic: string;
  portfolio_graphic_desc: string;
  portfolio_view_all: string;

  // Photography
  photo_label: string;
  photo_line1: string;
  photo_line2: string;
  photo_events: string;
  photo_events_desc: string;
  photo_food: string;
  photo_food_desc: string;
  photo_portraits: string;
  photo_portraits_desc: string;
  photo_concerts: string;
  photo_concerts_desc: string;
  photo_weddings: string;
  photo_weddings_desc: string;
  photo_corporate: string;
  photo_corporate_desc: string;
  photo_back: string;
  photo_explore: string;

  // Video
  video_label: string;
  video_line1: string;
  video_line2: string;
  video_showreel: string;
  video_wedding: string;
  video_event: string;
  video_brand: string;

  // Digital / Graphic Design
  graphic_label: string;
  graphic_line1: string;
  graphic_line2: string;
  graphic_desc: string;
  graphic_brand: string;
  graphic_brand_desc: string;
  graphic_logo: string;
  graphic_logo_desc: string;
  graphic_print: string;
  graphic_print_desc: string;
  graphic_packaging: string;
  graphic_packaging_desc: string;
  graphic_marketing: string;
  graphic_marketing_desc: string;
  graphic_digital_assets: string;
  graphic_digital_assets_desc: string;
  digital_label: string;
  digital_line1: string;
  digital_line2: string;
  digital_desc: string;
  digital_graphic_design: string;
  digital_social_media: string;
  digital_brand_identity: string;
  digital_logo: string;
  digital_marketing: string;
  digital_print: string;
  digital_packaging: string;
  digital_content_strategy: string;
  digital_visual_content: string;
  digital_scheduling: string;
  digital_community: string;
  digital_analytics: string;
  digital_web_design: string;
  digital_motion: string;
  digital_ui: string;
  digital_ads: string;

  // Pricing
  pricing_label: string;
  pricing_line1: string;
  pricing_line2: string;
  pricing_desc: string;
  pricing_starting: string;
  pricing_get_started: string;
  pricing_note: string;
  plan_essential: string;
  plan_essential_desc: string;
  plan_professional: string;
  plan_professional_desc: string;
  plan_premium: string;
  plan_premium_desc: string;
  feature_2h: string;
  feature_30photos: string;
  feature_digital: string;
  feature_1loc: string;
  feature_basic_retouch: string;
  feature_fullday: string;
  feature_100photos: string;
  feature_video3: string;
  feature_multiloc: string;
  feature_advanced_retouch: string;
  feature_gallery: string;
  feature_print: string;
  feature_multiday: string;
  feature_200photos: string;
  feature_full_video: string;
  feature_drone: string;
  feature_social_pkg: string;
  feature_brand_consult: string;
  feature_rush: string;
  feature_lifetime: string;

  // Blog
  blog_label: string;
  blog_line1: string;
  blog_line2: string;
  blog_view_all: string;
  blog_read_more: string;
  blog_post1_title: string;
  blog_post1_excerpt: string;
  blog_post1_cat: string;
  blog_post2_title: string;
  blog_post2_excerpt: string;
  blog_post2_cat: string;
  blog_post3_title: string;
  blog_post3_excerpt: string;
  blog_post3_cat: string;

  // Contact
  contact_label: string;
  contact_line1: string;
  contact_line2: string;
  contact_desc: string;
  contact_name: string;
  contact_name_ph: string;
  contact_email: string;
  contact_email_ph: string;
  contact_service: string;
  contact_service_ph: string;
  contact_service_photo: string;
  contact_service_video: string;
  contact_service_digital: string;
  contact_service_package: string;
  contact_message: string;
  contact_message_ph: string;
  contact_send: string;
  contact_get_in_touch: string;
  contact_location: string;
  contact_location_val: string;
  contact_follow: string;

  // Footer
  footer_tagline: string;
  footer_services: string;
  footer_connect: string;
  footer_photography: string;
  footer_videography: string;
  footer_digital: string;
  footer_pricing: string;
  footer_copyright: string;
  footer_privacy: string;
  footer_terms: string;
  footer_back_top: string;
}

const en: Translations = {
  nav_work: "Work",
  nav_photography: "Photography",
  nav_video: "Video",
  nav_digital: "Digital",
  nav_pricing: "Pricing",
  nav_journal: "Journal",
  nav_contact: "Contact",
  nav_cta: "Get in touch",
  nav_corporate: "Corporate Events",
  nav_weddings: "Weddings",
  nav_fashion: "Fashion",

  hero_line1: "I Create visuals.",
  hero_line2: "Tell stories.",
  hero_subtitle: "Event photography · Social media management · Video · Graphic design",
  hero_scroll: "Scroll to explore",
  hero_scroll_reels: "Scroll to explore reels",

  about_label: "About",
  about_heading1: "Hello, I'm",
  about_heading2: "Filomena.",
  about_p1: "A visual storyteller based in the heart of creativity. With over a decade of experience, I transform ordinary moments into extraordinary memories through the art of light and composition.",
  about_p2: "From intimate weddings to corporate events, fashion editorials to brand campaigns — each project is an opportunity to create something truly unique and meaningful.",
  about_photography: "Photography",
  about_videography: "Videography",
  about_digital_art: "Digital Art",

  portfolio_label: "Selected Work",
  portfolio_line1: "I Create visuals.",
  portfolio_line2: "Tell stories.",
  portfolio_photography: "Photography",
  portfolio_photography_desc: "Visual storytelling",
  portfolio_social: "Social Media Content",
  portfolio_social_desc: "Content creation & strategy",
  portfolio_video: "Video & Reels",
  portfolio_video_desc: "Motion & cinema",
  portfolio_graphic: "Graphic Design",
  portfolio_graphic_desc: "Brand & visual identity",
  portfolio_view_all: "View All Projects",

  photo_label: "Photography",
  photo_line1: "Capture life.",
  photo_line2: "Keep forever.",
  photo_events: "Events",
  photo_events_desc: "Concerts, Weddings, Corporate Events",
  photo_food: "Food",
  photo_food_desc: "Food photography",
  photo_portraits: "Portraits",
  photo_portraits_desc: "Portrait sessions",
  photo_concerts: "Concerts",
  photo_concerts_desc: "Live music & performances",
  photo_weddings: "Weddings",
  photo_weddings_desc: "Wedding photography",
  photo_corporate: "Corporate Events",
  photo_corporate_desc: "Corporate events",
  photo_back: "Back to categories",
  photo_explore: "Explore",

  video_label: "Videography",
  video_line1: "Stories in",
  video_line2: "motion.",
  video_showreel: "Showreel 2024 — 3:42",
  video_wedding: "Wedding Films",
  video_event: "Event Highlights",
  video_brand: "Brand Stories",

  graphic_label: "Graphic Design",
  graphic_line1: "Visual",
  graphic_line2: "identity.",
  graphic_desc: "Creating distinctive brand identities and visual systems that communicate your story.",
  graphic_brand: "Brand Identity",
  graphic_brand_desc: "Complete visual systems",
  graphic_logo: "Logo Design",
  graphic_logo_desc: "Memorable marks",
  graphic_print: "Print Design",
  graphic_print_desc: "Tangible materials",
  graphic_packaging: "Packaging",
  graphic_packaging_desc: "Product presentation",
  graphic_marketing: "Marketing Materials",
  graphic_marketing_desc: "Campaign assets",
  graphic_digital_assets: "Digital Assets",
  graphic_digital_assets_desc: "Web & social graphics",
  digital_label: "Digital Creative",
  digital_line1: "Beyond the",
  digital_line2: "lens.",
  digital_desc: "Comprehensive digital services to elevate your brand presence across all platforms.",
  digital_graphic_design: "Graphic Design",
  digital_social_media: "Social Media",
  digital_brand_identity: "Brand Identity Design",
  digital_logo: "Logo Creation",
  digital_marketing: "Marketing Materials",
  digital_print: "Print Design",
  digital_packaging: "Packaging Design",
  digital_content_strategy: "Content Strategy",
  digital_visual_content: "Visual Content Creation",
  digital_scheduling: "Post Scheduling",
  digital_community: "Community Management",
  digital_analytics: "Analytics & Reporting",
  digital_web_design: "Web Design",
  digital_motion: "Motion Graphics",
  digital_ui: "UI/UX Design",
  digital_ads: "Ad Campaigns",

  pricing_label: "Pricing",
  pricing_line1: "Invest in",
  pricing_line2: "your story.",
  pricing_desc: "Transparent pricing for exceptional creative services. Custom packages available upon request.",
  pricing_starting: "starting from",
  pricing_get_started: "Get Started",
  pricing_note: "All packages include consultation call. Travel fees may apply for locations outside the city.",
  plan_essential: "Essential",
  plan_essential_desc: "Perfect for personal projects and small events",
  plan_professional: "Professional",
  plan_professional_desc: "Ideal for weddings and corporate events",
  plan_premium: "Premium",
  plan_premium_desc: "Complete creative package for brands",
  feature_2h: "2-hour photo session",
  feature_30photos: "30 edited photos",
  feature_digital: "Digital delivery",
  feature_1loc: "1 location",
  feature_basic_retouch: "Basic retouching",
  feature_fullday: "Full day coverage",
  feature_100photos: "100+ edited photos",
  feature_video3: "Video highlights (3 min)",
  feature_multiloc: "Multiple locations",
  feature_advanced_retouch: "Advanced retouching",
  feature_gallery: "Online gallery",
  feature_print: "Print-ready files",
  feature_multiday: "Multi-day coverage",
  feature_200photos: "200+ edited photos",
  feature_full_video: "Full video production",
  feature_drone: "Drone footage",
  feature_social_pkg: "Social media package",
  feature_brand_consult: "Brand consultation",
  feature_rush: "Rush delivery option",
  feature_lifetime: "Lifetime gallery access",

  blog_label: "Journal",
  blog_line1: "Latest",
  blog_line2: "insights.",
  blog_view_all: "View All Articles",
  blog_read_more: "Read More",
  blog_post1_title: "The Art of Golden Hour Photography",
  blog_post1_excerpt: "Discover the secrets to capturing stunning photos during the magical golden hour.",
  blog_post1_cat: "Photography Tips",
  blog_post2_title: "Wedding Trends for 2025",
  blog_post2_excerpt: "Exploring the latest wedding photography and videography trends for the upcoming year.",
  blog_post2_cat: "Weddings",
  blog_post3_title: "Building Your Brand Visual Identity",
  blog_post3_excerpt: "A comprehensive guide to creating a cohesive visual identity for your business.",
  blog_post3_cat: "Branding",

  contact_label: "Contact",
  contact_line1: "Let's create",
  contact_line2: "together.",
  contact_desc: "Ready to bring your vision to life? Get in touch and let's discuss your project.",
  contact_name: "Your Name",
  contact_name_ph: "John Doe",
  contact_email: "Email Address",
  contact_email_ph: "john@example.com",
  contact_service: "Service Interest",
  contact_service_ph: "Select a service",
  contact_service_photo: "Photography",
  contact_service_video: "Videography",
  contact_service_digital: "Digital Creative",
  contact_service_package: "Full Package",
  contact_message: "Your Message",
  contact_message_ph: "Tell me about your project...",
  contact_send: "Send Message",
  contact_get_in_touch: "Get in Touch",
  contact_location: "Location",
  contact_location_val: "Available Worldwide",
  contact_follow: "Follow the Journey",

  footer_tagline: "Premium creative services for those who seek to capture life's most precious moments with artistry and intention.",
  footer_services: "Services",
  footer_connect: "Connect",
  footer_photography: "Photography",
  footer_videography: "Videography",
  footer_digital: "Digital Creative",
  footer_pricing: "Pricing",
  footer_copyright: "All rights reserved.",
  footer_privacy: "Privacy",
  footer_terms: "Terms",
  footer_back_top: "Back to Top",
};

const cz: Translations = {
  nav_work: "Práce",
  nav_photography: "Fotografie",
  nav_video: "Video",
  nav_digital: "Digitální",
  nav_pricing: "Ceník",
  nav_journal: "Žurnál",
  nav_contact: "Kontakt",
  nav_cta: "Napište mi",
  nav_corporate: "Firemní akce",
  nav_weddings: "Svatby",
  nav_fashion: "Móda",

  hero_line1: "Tvořím vizuály.",
  hero_line2: "Vyprávím příběhy.",
  hero_subtitle: "Eventová fotografie · Správa sociálních sítí · Video · Grafický design",
  hero_scroll: "Procházejte dolů",
  hero_scroll_reels: "Procházejte reels",

  about_label: "O mně",
  about_heading1: "Ahoj, jsem",
  about_heading2: "Filoména.",
  about_p1: "Vizuální vypravěčka z centra kreativity. S více než desetiletou zkušeností proměňuji obyčejné okamžiky v neobyčejné vzpomínky prostřednictvím světla a kompozice.",
  about_p2: "Od intimních svateb po firemní akce, módní editoraly po brandové kampaně — každý projekt je příležitostí vytvořit něco skutečně jedinečného a smysluplného.",
  about_photography: "Fotografie",
  about_videography: "Videografie",
  about_digital_art: "Digitální umění",

  portfolio_label: "Vybraná práce",
  portfolio_line1: "Tvořím vizuály.",
  portfolio_line2: "Vyprávím příběhy.",
  portfolio_photography: "Fotografie",
  portfolio_photography_desc: "Vizuální vyprávění",
  portfolio_social: "Obsah pro sociální sítě",
  portfolio_social_desc: "Tvorba obsahu & strategie",
  portfolio_video: "Video & Reels",
  portfolio_video_desc: "Pohyb & kino",
  portfolio_graphic: "Grafický design",
  portfolio_graphic_desc: "Značka & vizuální identita",
  portfolio_view_all: "Zobrazit všechny projekty",

  photo_label: "Fotografie",
  photo_line1: "Zachyťte život.",
  photo_line2: "Navždy.",
  photo_events: "Eventy",
  photo_events_desc: "Koncerty, Svatby, Firemní akce",
  photo_food: "Jídlo",
  photo_food_desc: "Potravinářská fotografie",
  photo_portraits: "Portréty",
  photo_portraits_desc: "Portrétní focení",
  photo_concerts: "Koncerty",
  photo_concerts_desc: "Živá hudba & vystoupení",
  photo_weddings: "Svatby",
  photo_weddings_desc: "Svatební fotografie",
  photo_corporate: "Firemní akce",
  photo_corporate_desc: "Korporátní eventy",
  photo_back: "Zpět na kategorie",
  photo_explore: "Prozkoumat",

  video_label: "Videografie",
  video_line1: "Příběhy v",
  video_line2: "pohybu.",
  video_showreel: "Showreel 2024 — 3:42",
  video_wedding: "Svatební filmy",
  video_event: "Eventové sestřihy",
  video_brand: "Brandové příběhy",

  graphic_label: "Grafický design",
  graphic_line1: "Vizuální",
  graphic_line2: "identita.",
  graphic_desc: "Vytváříme jedinečné brandové identity a vizuální systémy, které komunikují váš příběh.",
  graphic_brand: "Identita značky",
  graphic_brand_desc: "Kompletní vizuální systémy",
  graphic_logo: "Design loga",
  graphic_logo_desc: "Nezapomenutelné značky",
  graphic_print: "Tisk & tiskoviny",
  graphic_print_desc: "Hmotné materiály",
  graphic_packaging: "Packaging",
  graphic_packaging_desc: "Prezentace produktu",
  graphic_marketing: "Marketingové materiály",
  graphic_marketing_desc: "Kampaňové podklady",
  graphic_digital_assets: "Digitální podklady",
  graphic_digital_assets_desc: "Grafika pro web & sociální sítě",
  digital_label: "Digitální kreativa",
  digital_line1: "Přesah",
  digital_line2: "objektivu.",
  digital_desc: "Komplexní digitální služby pro posílení vaší přítomnosti na všech platformách.",
  digital_graphic_design: "Grafický design",
  digital_social_media: "Sociální sítě",
  digital_brand_identity: "Design brandové identity",
  digital_logo: "Tvorba loga",
  digital_marketing: "Marketingové materiály",
  digital_print: "Tisková tvorba",
  digital_packaging: "Design obalů",
  digital_content_strategy: "Obsahová strategie",
  digital_visual_content: "Tvorba vizuálního obsahu",
  digital_scheduling: "Plánování příspěvků",
  digital_community: "Správa komunity",
  digital_analytics: "Analytika & reporty",
  digital_web_design: "Web design",
  digital_motion: "Motion grafika",
  digital_ui: "UI/UX design",
  digital_ads: "Reklamní kampaně",

  pricing_label: "Ceník",
  pricing_line1: "Investujte do",
  pricing_line2: "svého příběhu.",
  pricing_desc: "Transparentní ceny za výjimečné kreativní služby. Vlastní balíčky k dispozici na vyžádání.",
  pricing_starting: "od",
  pricing_get_started: "Začít",
  pricing_note: "Všechny balíčky zahrnují konzultační hovor. Cestovní náklady mohou být účtovány pro lokace mimo město.",
  plan_essential: "Základní",
  plan_essential_desc: "Ideální pro osobní projekty a malé akce",
  plan_professional: "Profesionální",
  plan_professional_desc: "Perfektní pro svatby a firemní akce",
  plan_premium: "Premium",
  plan_premium_desc: "Kompletní kreativní balíček pro značky",
  feature_2h: "2hodinové focení",
  feature_30photos: "30 upravených fotek",
  feature_digital: "Digitální doručení",
  feature_1loc: "1 lokace",
  feature_basic_retouch: "Základní retušování",
  feature_fullday: "Celodenní pokrytí",
  feature_100photos: "100+ upravených fotek",
  feature_video3: "Video sestřih (3 min)",
  feature_multiloc: "Více lokací",
  feature_advanced_retouch: "Pokročilé retušování",
  feature_gallery: "Online galerie",
  feature_print: "Soubory připravené k tisku",
  feature_multiday: "Vícedenní pokrytí",
  feature_200photos: "200+ upravených fotek",
  feature_full_video: "Kompletní video produkce",
  feature_drone: "Záběry z dronu",
  feature_social_pkg: "Balíček pro sociální sítě",
  feature_brand_consult: "Brandová konzultace",
  feature_rush: "Možnost expresního doručení",
  feature_lifetime: "Doživotní přístup ke galerii",

  blog_label: "Žurnál",
  blog_line1: "Nejnovější",
  blog_line2: "postřehy.",
  blog_view_all: "Zobrazit všechny články",
  blog_read_more: "Číst více",
  blog_post1_title: "Umění fotografie zlaté hodiny",
  blog_post1_excerpt: "Odhalte tajemství zachycení úžasných fotografií v kouzelnou zlatou hodinu.",
  blog_post1_cat: "Tipy pro fotografy",
  blog_post2_title: "Svatební trendy pro rok 2025",
  blog_post2_excerpt: "Prozkoumání nejnovějších trendů ve svatební fotografii a videografii pro nadcházející rok.",
  blog_post2_cat: "Svatby",
  blog_post3_title: "Budování vizuální identity vaší značky",
  blog_post3_excerpt: "Komplexní průvodce vytvořením soudržné vizuální identity pro vaše podnikání.",
  blog_post3_cat: "Branding",

  contact_label: "Kontakt",
  contact_line1: "Pojďme tvořit",
  contact_line2: "společně.",
  contact_desc: "Připraveni přivést vaši vizi k životu? Ozvěte se a pojďme probrat váš projekt.",
  contact_name: "Vaše jméno",
  contact_name_ph: "Jan Novák",
  contact_email: "E-mailová adresa",
  contact_email_ph: "jan@priklad.cz",
  contact_service: "Zájem o službu",
  contact_service_ph: "Vyberte službu",
  contact_service_photo: "Fotografie",
  contact_service_video: "Videografie",
  contact_service_digital: "Digitální kreativa",
  contact_service_package: "Kompletní balíček",
  contact_message: "Vaše zpráva",
  contact_message_ph: "Řekněte mi o svém projektu...",
  contact_send: "Odeslat zprávu",
  contact_get_in_touch: "Spojme se",
  contact_location: "Lokalita",
  contact_location_val: "Dostupná po celém světě",
  contact_follow: "Sledujte cestu",

  footer_tagline: "Prémiové kreativní služby pro ty, kteří hledají zachycení nejcennějších životních okamžiků s uměleckým záměrem.",
  footer_services: "Služby",
  footer_connect: "Spojení",
  footer_photography: "Fotografie",
  footer_videography: "Videografie",
  footer_digital: "Digitální kreativa",
  footer_pricing: "Ceník",
  footer_copyright: "Všechna práva vyhrazena.",
  footer_privacy: "Soukromí",
  footer_terms: "Podmínky",
  footer_back_top: "Zpět nahoru",
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: lang === "EN" ? en : cz }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
