"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: t.nav_work, href: "#work" },
    {
      label: t.nav_photography,
      href: "#photography",
      dropdown: [
        { label: t.nav_corporate, href: "#corporate" },
        { label: t.nav_weddings, href: "#weddings" },
        { label: t.nav_fashion, href: "#fashion" },
      ],
    },
    { label: t.nav_video, href: "#video" },
    { label: t.nav_digital, href: "#digital" },
    { label: t.nav_pricing, href: "#pricing" },
    { label: t.nav_journal, href: "#blog" },
    { label: t.nav_contact, href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
              </Link>

              {item.dropdown && openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-4 py-3 min-w-[180px] bg-white rounded-xl shadow-xl">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:text-[#5046e5] hover:bg-gray-50 transition-all duration-200"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: language toggle + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-sm font-sans">
            <button
              onClick={() => setLang("EN")}
              className={`px-2 py-1 rounded transition-colors duration-200 ${
                lang === "EN" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              EN
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={() => setLang("CZ")}
              className={`px-2 py-1 rounded transition-colors duration-200 ${
                lang === "CZ" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              CZ
            </button>
          </div>

          <a
            href="#contact"
            className="btn-blue text-sm"
          >
            {t.nav_cta}
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
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base text-white/70 hover:text-white transition-colors py-2 block"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-white/50 hover:text-white transition-colors py-1"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile language toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-2">
              <button
                onClick={() => setLang("EN")}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  lang === "EN"
                    ? "border-white/40 text-white"
                    : "border-white/10 text-white/40"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("CZ")}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  lang === "CZ"
                    ? "border-white/40 text-white"
                    : "border-white/10 text-white/40"
                }`}
              >
                CZ
              </button>
            </div>

            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-blue text-sm text-center mt-2"
            >
              {t.nav_cta}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
