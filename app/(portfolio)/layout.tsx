import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/language-context'
import ClarityScript from '@/components/ClarityScript'
import { LegalFooter } from '@/components/legal-footer'
import '../globals.css'

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
    default: 'Filografie | Filoména — Visual storytelling',
    template: '%s | Filografie',
  },
  description:
    'Filoména — event and food photography, video reels and branded content, social media management and UGC. Visual storytelling.',
  keywords: [
    'photography',
    'event photography',
    'food photography',
    'video',
    'reels',
    'UGC',
    'social media',
    'Filoména',
    'Filografie',
  ],
  authors: [{ name: 'Filoména' }],
  alternates: {
    canonical: '/',
    languages: { en: '/', cs: '/cs' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'cs_CZ',
    title: 'Filoména | Photographer & Content Creator',
    description: 'Photographer, videographer and content creator 📸🎬',
    url: siteUrl,
    siteName: 'Filografie',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filoména | Photographer & Content Creator',
    description: 'Photographer, videographer and content creator 📸🎬',
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
    <html lang="en" className={`${fraunces.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ClarityScript />
        <LanguageProvider>{children}</LanguageProvider>
        <LegalFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
