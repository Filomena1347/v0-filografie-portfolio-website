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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-solid ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-serif text-2xl tracking-wide text-[#f5f5f7]"
        >
          Filografie
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
                className="flex items-center gap-1 text-[13px] font-light tracking-wide text-[#a1a1aa] nav-link"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
              </Link>
              
              {item.dropdown && openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-4 py-3 min-w-[180px] bg-[#111118] border border-[#9D4EDD]/10 rounded-sm">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-5 py-2.5 text-[13px] font-light text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors"
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
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0f] border-t border-[#9D4EDD]/10 py-6">
          <div className="max-w-6xl mx-auto px-8 flex flex-col gap-5">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-light tracking-wide text-[#a1a1aa] nav-link"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 mt-3 flex flex-col gap-3">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[12px] font-light text-[#71717a] hover:text-[#9D4EDD] transition-colors"
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
