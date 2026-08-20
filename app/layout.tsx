import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AdminProvider } from '@/contexts/admin-context'
import { LanguageProvider } from '@/contexts/language-context'
import { AdminLogin } from '@/components/admin-login'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Filografie | Creative Portfolio',
  description: 'Premium creative services - Photography, Videography, and Digital Creative by Filomena',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} bg-[#0a0a14]`}>
      <body className="font-sans antialiased bg-[#0a0a14] text-white">
        <LanguageProvider>
          <AdminProvider>
            {children}
            <AdminLogin />
          </AdminProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
