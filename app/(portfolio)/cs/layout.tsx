import type { Metadata } from 'next'
import { LanguageProvider } from '@/context/language-context'

const siteUrl = 'https://filography.com'
const ogImage = {
  url: 'https://filography.com/og-image.jpg',
  width: 750,
  height: 750,
  alt: 'Filoména',
}

export const metadata: Metadata = {
  title: { absolute: 'Filografie | Filoména — Vizuální vyprávění příběhů' },
  description:
    'Filoména — event a gastro fotografie, video reels a brandový obsah, správa sociálních sítí a UGC. Vizuální vyprávění příběhů.',
  alternates: {
    canonical: '/cs',
    languages: { en: '/', cs: '/cs' },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    alternateLocale: 'en_US',
    title: 'Filoména | Fotografka & Content Creator',
    description: 'Fotografka, kameramanka a content creator 📸🎬',
    url: `${siteUrl}/cs`,
    siteName: 'Filografie',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filoména | Fotografka & Content Creator',
    description: 'Fotografka, kameramanka a content creator 📸🎬',
    images: [ogImage.url],
  },
}

export default function CsLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider initialLang="cs">{children}</LanguageProvider>
}
