"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Photography", href: "#photography", expandPhotography: true },
  { label: "Video", href: "#video" },
  { label: "Digital", href: "#digital" },
  { label: "Pricing", href: "#pricing" },
  { label: "Journal", href: "#blog" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            <div key={item.label} className="relative">
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

        {/* CTA Button */}
        <a 
          href="#contact"
          className="hidden lg:block btn-blue text-sm"
        >
          Get in touch
        </a>

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
            <a 
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-blue text-sm text-center mt-4"
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
