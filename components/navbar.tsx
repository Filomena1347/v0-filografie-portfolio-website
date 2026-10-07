"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"

export function Navbar() {
  const { t, lang, toggle } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#photography", label: t.nav_photography },
    { href: "#video", label: t.nav_video },
    { href: "#content", label: t.nav_content },
    { href: "#contact", label: t.nav_contact },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-sm border-b border-border" : "bg-background"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        <a href="#top" className="flex flex-col leading-none">
          <span className="font-serif italic text-2xl text-foreground">Filoména</span>
          <span className="mt-1 font-sans text-[11px] font-light tracking-wide text-muted-foreground">
            content creator
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="text-xs tracking-widest text-foreground/60 hover:text-primary transition-colors"
          >
            <span className={lang === "cs" ? "text-primary font-medium" : ""}>CZ</span>
            <span className="mx-1 text-foreground/30">/</span>
            <span className={lang === "en" ? "text-primary font-medium" : ""}>EN</span>
          </button>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center rounded-full bg-primary text-primary-foreground text-sm px-5 py-2 hover:opacity-90 transition-opacity"
          >
            {t.nav_cta}
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="w-6 h-px bg-foreground" />
            <span className="w-6 h-px bg-foreground" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-wide text-foreground/80"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
