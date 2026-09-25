import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/language-context'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = 'https://filografie.vercel.app'

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
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    alternateLocale: 'en_US',
    title: 'Filografie | Filoména — Vizuální vyprávění příběhů',
    description:
      'Event a gastro fotografie, video reels a brandový obsah, správa sociálních sítí a UGC.',
    url: siteUrl,
    siteName: 'Filografie',
    images: [{ url: '/images/hero.png', width: 1200, height: 800, alt: 'Filografie' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filografie | Filoména',
    description: 'Vizuální vyprávění příběhů — foto, video, obsah.',
    images: ['/images/hero.png'],
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
    <html lang="cs" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
