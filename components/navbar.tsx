"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"

const navItems = [
  { label: "Work", href: "#work" },
  { 
    label: "Photography", 
    href: "#photography",
    dropdown: [
      { label: "Corporate Events", href: "#corporate" },
      { label: "Weddings", href: "#weddings" },
      { label: "Fashion", href: "#fashion" },
    ]
  },
  { label: "Video", href: "#video" },
  { label: "Digital", href: "#digital" },
  { label: "Pricing", href: "#pricing" },
  { label: "Journal", href: "#blog" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-dark ${
        isScrolled ? "py-5" : "py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-serif text-xl tracking-[0.1em] text-white font-medium"
        >
          FILOGRAFIE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <div 
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 text-[11px] tracking-[0.15em] uppercase font-light text-white/60 hover:text-white transition-colors duration-300"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-3 h-3 opacity-40" />}
              </Link>
              
              {item.dropdown && openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-6 py-4 min-w-[180px] bg-[#0c0c10] border border-white/5">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-6 py-3 text-[11px] tracking-[0.1em] uppercase font-light text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#050507] border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[11px] tracking-[0.15em] uppercase font-light text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 mt-4 flex flex-col gap-3">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] tracking-[0.1em] uppercase font-light text-white/40 hover:text-white transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
