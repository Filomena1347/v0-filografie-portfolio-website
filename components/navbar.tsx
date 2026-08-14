"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const navItems = [
    // HIDDEN - uncomment to show
    // { label: t.nav.work, href: "#work" },
    { label: t.nav.photography, href: "#photography", expandPhotography: true },
    { label: t.nav.video, href: "#video" },
    // HIDDEN - uncomment to show
    // { label: t.nav.digital, href: "#digital" },
    // HIDDEN - uncomment to show
    // { label: t.nav.pricing, href: "#pricing" },
    // HIDDEN - uncomment to show
    // { label: t.nav.journal, href: "#blog" },
    { label: t.nav.contact, href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const LanguageToggle = ({ className = "" }: { className?: string }) => (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className={`flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 ${className}`}
    >
      <span className={language === "en" ? "text-white" : ""}>EN</span>
      <span className="text-white/30">/</span>
      <span className={language === "cz" ? "text-white" : ""}>CZ</span>
    </button>
  )

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 bg-[#0a0a14]/95 backdrop-blur-sm" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-serif text-2xl font-bold italic text-white"
        >
          Filoména
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                onClick={item.expandPhotography ? () => window.dispatchEvent(new Event("photography:expand")) : undefined}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Language toggle + CTA Button */}
        <div className="hidden lg:flex items-center gap-6">
          <LanguageToggle />
          <a 
            href="#contact"
            className="btn-blue text-sm"
          >
            {t.nav.getInTouch}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a14] border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    if (item.expandPhotography) {
                      window.dispatchEvent(new Event("photography:expand"))
                    }
                  }}
                  className="text-base text-white/70 hover:text-white transition-colors py-2 block"
                >
                  {item.label}
                </Link>
              </div>
            ))}
            <LanguageToggle className="py-2" />
            <a 
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-blue text-sm text-center mt-4"
            >
              {t.nav.getInTouch}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
