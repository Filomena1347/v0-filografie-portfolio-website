"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"

const navItems = [
  { label: "WORK", href: "#work" },
  { 
    label: "PHOTOGRAPHY", 
    href: "#photography",
    dropdown: [
      { label: "Corporate Events", href: "#corporate" },
      { label: "Weddings", href: "#weddings" },
      { label: "Fashion", href: "#fashion" },
    ]
  },
  { label: "VIDEO", href: "#video" },
  { label: "DIGITAL CREATIVE", href: "#digital" },
  { label: "PRICING", href: "#pricing" },
  { label: "BLOG", href: "#blog" },
  { label: "CONTACT", href: "#contact" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-nav ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-light tracking-wider gradient-text"
        >
          Filografie
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div 
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 text-xs font-light tracking-[0.2em] text-[#a1a1aa] neon-hover"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-3 h-3" />}
              </Link>
              
              {item.dropdown && openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 py-2 min-w-[180px] glass-card rounded-lg">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-4 py-2 text-xs tracking-wider text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors"
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
          className="lg:hidden p-2 text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-nav border-t border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-light tracking-[0.2em] text-[#a1a1aa] neon-hover"
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
                        className="text-xs tracking-wider text-[#71717a] hover:text-[#9D4EDD] transition-colors"
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
