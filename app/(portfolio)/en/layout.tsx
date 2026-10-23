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
  alternates: {
    canonical: '/en',
    languages: { cs: '/', en: '/en' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'cs_CZ',
    title: 'Filoména | Photographer & Content Creator',
    description: 'Photographer, videographer and content creator 📸🎬',
    url: `${siteUrl}/en`,
    siteName: 'Filografie',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filoména | Photographer & Content Creator',
    description: 'Photographer, videographer and content creator 📸🎬',
    images: [ogImage.url],
  },
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider initialLang="en">{children}</LanguageProvider>
}
