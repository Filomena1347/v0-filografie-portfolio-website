import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/language-context'
import ClarityScript from '@/components/ClarityScript'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = 'https://filography.com'
const ogImage = {
  url: 'https://filography.com/og-image.jpg',
  width: 750,
  height: 750,
  alt: 'Filoména',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Filografie | Filoména — Vizuální vyprávění příběhů',
    template: '%s | Filografie',
  },
  description:
    'Filoména — event a gastro fotografie, video reels a brandový obsah, správa sociálních sítí a UGC. Vizuální vyprávění příběhů.',
  keywords: [
    'fotografie',
    'event fotografie',
    'gastro fotografie',
    'video',
    'reels',
    'UGC',
    'sociální sítě',
    'Filoména',
    'Filografie',
  ],
  authors: [{ name: 'Filoména' }],
  alternates: {
    canonical: '/',
    languages: { cs: '/', en: '/en' },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    alternateLocale: 'en_US',
    title: 'Filoména | Fotografka & Content Creator',
    description: 'Fotografka, kameramanka a content creator 📸🎬',
    url: siteUrl,
    siteName: 'Filografie',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filoména | Fotografka & Content Creator',
    description: 'Fotografka, kameramanka a content creator 📸🎬',
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${fraunces.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ClarityScript />
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
