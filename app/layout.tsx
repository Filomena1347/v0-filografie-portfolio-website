import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Filografie | Creative Portfolio',
  description: 'Premium creative services - Photography, Videography, and Digital Creative by Filoména',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} bg-[#050507]`}>
      <body className="font-sans antialiased bg-[#050507] text-[#f5f5f7]">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
