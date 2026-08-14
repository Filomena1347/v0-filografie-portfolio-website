"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "cz" | "en";

export interface Translations {
  nav: {
    work: string;
    photography: string;
    video: string;
    digital: string;
    pricing: string;
    journal: string;
    contact: string;
    getInTouch: string;
  };
  hero: {
    headingLine1: string;
    headingLine2: string;
    subtitle: string;
    viewAllPhotos: string;
    scrollExplore: string;
    scrollExploreVertical: string;
  };
  photography: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    noImages: string;
    loginToUpload: string;
    useUploadButton: string;
    closeGallery: string;
    viewAllPhotos: string;
  };
  video: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
  };
  digital: {
    graphicDesignEyebrow: string;
    graphicDesignHeadingLine1: string;
    graphicDesignHeadingLine2: string;
    graphicDesignDescription: string;
    graphicDesignItems: { title: string; description: string }[];
    creativeEyebrow: string;
    creativeHeadingLine1: string;
    creativeHeadingLine2: string;
    creativeDescription: string;
    services: { category: string; items: string[] }[];
    features: { label: string }[];
  };
  pricing: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    startingFrom: string;
    getStarted: string;
    footnote: string;
    plans: { name: string; description: string; features: string[] }[];
  };
  contact: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      service: string;
      selectService: string;
      serviceOptions: {
        photography: string;
        video: string;
        digital: string;
        package: string;
      };
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
    getInTouch: string;
    email: string;
    instagram: string;
    location: string;
    locationValue: string;
    followJourney: string;
  };
  footer: {
    description: string;
    servicesHeading: string;
    services: string[];
    connectHeading: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
    backToTop: string;
  };
}

const translations: Record<Language, Translations> = {
  cz: {
    nav: {
      work: "Práce",
      photography: "Fotografie",
      video: "Reels",
      digital: "Digitální",
      pricing: "Ceník",
      journal: "Blog",
      contact: "Kontakt",
      getInTouch: "Spojme se",
    },
    hero: {
      headingLine1: "Tvořím vizuály.",
      headingLine2: "Vyprávím příběhy.",
      subtitle: "Eventová fotografie · Správa sociálních sítí · Video · Grafický design",
      viewAllPhotos: "Zobrazit všechny fotky",
      scrollExplore: "Posuňte pro prohlédnutí rolí",
      scrollExploreVertical: "Posuňte pro prohlédnutí",
    },
    photography: {
      eyebrow: "Fotografie",
      headingLine1: "Zachyťte život.",
      headingLine2: "Uchovejte navždy.",
      noImages: "Zatím žádné obrázky.",
      loginToUpload: "Přihlásit se pro nahrání obrázků",
      useUploadButton: "Pro přidání obrázků použijte tlačítko nahrát výše.",
      closeGallery: "Zavřít galerii",
      viewAllPhotos: "Zobrazit všechny fotky",
    },
    video: {
      eyebrow: "Reels",
      headingLine1: "Příběhy v",
      headingLine2: "reels.",
    },
    digital: {
      graphicDesignEyebrow: "Grafický design",
      graphicDesignHeadingLine1: "Vizuální",
      graphicDesignHeadingLine2: "identita.",
      graphicDesignDescription: "Vytváříme výrazné vizuální identity a systémy, které vyprávějí váš příběh.",
      graphicDesignItems: [
        { title: "Firemní identita", description: "Kompletní vizuální systémy" },
        { title: "Design loga", description: "Nezapomenutelné znaky" },
        { title: "Tiskový design", description: "Hmatatelné materiály" },
        { title: "Obalový design", description: "Prezentace produktu" },
        { title: "Marketingové materiály", description: "Kampaňové podklady" },
        { title: "Digitální podklady", description: "Web a sociální grafika" },
      ],
      creativeEyebrow: "Digitální tvorba",
      creativeHeadingLine1: "Za hranice",
      creativeHeadingLine2: "objektivu.",
      creativeDescription: "Komplexní digitální služby pro posílení vaší značky na všech platformách.",
      services: [
        {
          category: "Grafický design",
          items: [
            "Design firemní identity",
            "Tvorba loga",
            "Marketingové materiály",
            "Tiskový design",
            "Obalový design",
          ],
        },
        {
          category: "Sociální sítě",
          items: [
            "Obsahová strategie",
            "Tvorba vizuálního obsahu",
            "Plánování příspěvků",
            "Správa komunity",
            "Analýzy a reporty",
          ],
        },
      ],
      features: [
        { label: "Webdesign" },
        { label: "Motion graphics" },
        { label: "UI/UX design" },
        { label: "Reklamní kampaně" },
      ],
    },
    pricing: {
      eyebrow: "Ceník",
      headingLine1: "Investujte do",
      headingLine2: "svého příběhu.",
      description: "Transparentní ceny za výjimečné kreativní služby. Balíčky na míru na požádání.",
      startingFrom: "od",
      getStarted: "Začít",
      footnote: "Všechny balíčky zahrnují konzultační hovor. Za lokace mimo město mohou být účtovány cestovní náklady.",
      plans: [
        {
          name: "Základní",
          description: "Ideální pro osobní projekty a menší akce",
          features: [
            "2hodinové focení",
            "30 upravených fotek",
            "Digitální dodání",
            "1 lokace",
            "Základní retuš",
          ],
        },
        {
          name: "Profesionální",
          description: "Ideální pro svatby a firemní akce",
          features: [
            "Celodenní pokrytí",
            "100+ upravených fotek",
            "Video sestřih (3 min)",
            "Více lokací",
            "Pokročilá retuš",
            "Online galerie",
            "Soubory připravené k tisku",
          ],
        },
        {
          name: "Prémiový",
          description: "Kompletní kreativní balíček pro značky",
          features: [
            "Vícedenní pokrytí",
            "200+ upravených fotek",
            "Kompletní video produkce",
            "Dronové záběry",
            "Balíček pro sociální sítě",
            "Konzultace značky",
            "Expresní dodání",
            "Trvalý přístup do galerie",
          ],
        },
      ],
    },
    contact: {
      eyebrow: "Kontakt",
      headingLine1: "Tvořme",
      headingLine2: "společně.",
      description: "Chcete uskutečnit svou vizi? Ozvěte se a proberme váš projekt.",
      form: {
        name: "Vaše jméno",
        namePlaceholder: "Jan Novák",
        email: "E-mailová adresa",
        emailPlaceholder: "jan@example.com",
        service: "Zájem o službu",
        selectService: "Vyberte službu",
        serviceOptions: {
          photography: "Fotografie",
          video: "Reels",
          digital: "Digitální tvorba",
          package: "Kompletní balíček",
        },
        message: "Vaše zpráva",
        messagePlaceholder: "Napište mi o svém projektu...",
        submit: "Odeslat zprávu",
      },
      getInTouch: "Ozvěte se",
      email: "E-mail",
      instagram: "Instagram",
      location: "Lokace",
      locationValue: "Dostupná po celém světě",
      followJourney: "Sledujte mou cestu",
    },
    footer: {
      description: "Prémiové kreativní služby pro ty, kdo chtějí zachytit nejvzácnější okamžiky života s uměním a záměrem.",
      servicesHeading: "Služby",
      services: ["Fotografie", "Reels", "Digitální tvorba", "Ceník"],
      connectHeading: "Kontakt",
      allRightsReserved: "Všechna práva vyhrazena.",
      privacy: "Ochrana soukromí",
      terms: "Podmínky",
      backToTop: "Nahoru",
    },
  },
  en: {
    nav: {
      work: "Work",
      photography: "Photography",
      video: "Reels",
      digital: "Digital",
      pricing: "Pricing",
      journal: "Journal",
      contact: "Contact",
      getInTouch: "Get in touch",
    },
    hero: {
      headingLine1: "I Create visuals.",
      headingLine2: "Tell stories.",
      subtitle: "Event photography · Social media management · Video · Graphic design",
      viewAllPhotos: "View all photos",
      scrollExplore: "Scroll to explore reels",
      scrollExploreVertical: "Scroll to explore",
    },
    photography: {
      eyebrow: "Photography",
      headingLine1: "Capture life.",
      headingLine2: "Keep forever.",
      noImages: "No images yet.",
      loginToUpload: "Login to upload images",
      useUploadButton: "Use the upload button above to add images.",
      closeGallery: "Close gallery",
      viewAllPhotos: "View all photos",
    },
    video: {
      eyebrow: "Reels",
      headingLine1: "Stories in",
      headingLine2: "reels.",
    },
    digital: {
      graphicDesignEyebrow: "Graphic Design",
      graphicDesignHeadingLine1: "Visual",
      graphicDesignHeadingLine2: "identity.",
      graphicDesignDescription: "Creating distinctive brand identities and visual systems that communicate your story.",
      graphicDesignItems: [
        { title: "Brand Identity", description: "Complete visual systems" },
        { title: "Logo Design", description: "Memorable marks" },
        { title: "Print Design", description: "Tangible materials" },
        { title: "Packaging", description: "Product presentation" },
        { title: "Marketing Materials", description: "Campaign assets" },
        { title: "Digital Assets", description: "Web & social graphics" },
      ],
      creativeEyebrow: "Digital Creative",
      creativeHeadingLine1: "Beyond the",
      creativeHeadingLine2: "lens.",
      creativeDescription: "Comprehensive digital services to elevate your brand presence across all platforms.",
      services: [
        {
          category: "Graphic Design",
          items: [
            "Brand Identity Design",
            "Logo Creation",
            "Marketing Materials",
            "Print Design",
            "Packaging Design",
          ],
        },
        {
          category: "Social Media",
          items: [
            "Content Strategy",
            "Visual Content Creation",
            "Post Scheduling",
            "Community Management",
            "Analytics & Reporting",
          ],
        },
      ],
      features: [
        { label: "Web Design" },
        { label: "Motion Graphics" },
        { label: "UI/UX Design" },
        { label: "Ad Campaigns" },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      headingLine1: "Invest in",
      headingLine2: "your story.",
      description: "Transparent pricing for exceptional creative services. Custom packages available upon request.",
      startingFrom: "starting from",
      getStarted: "Get Started",
      footnote: "All packages include consultation call. Travel fees may apply for locations outside the city.",
      plans: [
        {
          name: "Essential",
          description: "Perfect for personal projects and small events",
          features: [
            "2-hour photo session",
            "30 edited photos",
            "Digital delivery",
            "1 location",
            "Basic retouching",
          ],
        },
        {
          name: "Professional",
          description: "Ideal for weddings and corporate events",
          features: [
            "Full day coverage",
            "100+ edited photos",
            "Video highlights (3 min)",
            "Multiple locations",
            "Advanced retouching",
            "Online gallery",
            "Print-ready files",
          ],
        },
        {
          name: "Premium",
          description: "Complete creative package for brands",
          features: [
            "Multi-day coverage",
            "200+ edited photos",
            "Full video production",
            "Drone footage",
            "Social media package",
            "Brand consultation",
            "Rush delivery option",
            "Lifetime gallery access",
          ],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      headingLine1: "Let's create",
      headingLine2: "together.",
      description: "Ready to bring your vision to life? Get in touch and let's discuss your project.",
      form: {
        name: "Your Name",
        namePlaceholder: "John Doe",
        email: "Email Address",
        emailPlaceholder: "john@example.com",
        service: "Service Interest",
        selectService: "Select a service",
        serviceOptions: {
          photography: "Photography",
          video: "Reels",
          digital: "Digital Creative",
          package: "Full Package",
        },
        message: "Your Message",
        messagePlaceholder: "Tell me about your project...",
        submit: "Send Message",
      },
      getInTouch: "Get in Touch",
      email: "Email",
      instagram: "Instagram",
      location: "Location",
      locationValue: "Available Worldwide",
      followJourney: "Follow the Journey",
    },
    footer: {
      description: "Premium creative services for those who seek to capture life's most precious moments with artistry and intention.",
      servicesHeading: "Services",
      services: ["Photography", "Reels", "Digital Creative", "Pricing"],
      connectHeading: "Connect",
      allRightsReserved: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      backToTop: "Back to Top",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("cz");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "cz" ? "en" : "cz"));
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
