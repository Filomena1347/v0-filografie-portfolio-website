"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"

export function Navbar() {
  const { t, lang, toggle } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // The nested /en provider sits inside the root one, so only the navbar (innermost consumer) owns <html lang>.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#work", label: t.nav_work },
    { href: "#about", label: t.nav_about },
    { href: "#contact", label: t.nav_contact },
  ]

  return (
    <header
      className={`absolute md:fixed top-0 inset-x-0 z-20 md:z-50 bg-transparent transition-colors duration-300 ${
        scrolled
          ? "md:bg-background/90 md:backdrop-blur-sm md:border-b md:border-border"
          : "md:bg-background"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        <a href="#top" className="flex flex-col leading-none">
          <span className="font-serif italic text-[26px] text-white md:text-2xl md:text-foreground">Filoména</span>
          <span className="hidden md:block mt-1 font-sans text-[11px] font-light tracking-wide text-muted-foreground">
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
            className="text-[13px] tracking-[0.05em] text-white md:text-xs md:tracking-widest md:text-foreground/60 hover:text-primary transition-colors"
          >
            <span className={lang === "cs" ? "text-[#A78BFA] md:text-primary font-medium" : ""}>CZ</span>
            <span className="mx-1 text-white md:text-foreground/30">/</span>
            <span className={lang === "en" ? "text-[#A78BFA] md:text-primary font-medium" : ""}>EN</span>
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
            <span className="w-6 h-px bg-white md:bg-foreground" />
            <span className="w-6 h-px bg-white md:bg-foreground" />
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
