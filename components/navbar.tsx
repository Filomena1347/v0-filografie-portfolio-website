"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useLanguage } from "@/context/language-context"
import { WhatsAppIcon } from "@/components/brand-icons"

export function Navbar() {
  const { t, lang, toggle } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [menuOpen])

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

          <a
            href="https://wa.me/420604889980"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav_whatsapp}
            title={t.nav_whatsapp}
            className="hidden md:inline-flex h-9 w-9 items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="w-6 h-px bg-white md:bg-foreground" />
            <span className="w-6 h-px bg-white md:bg-foreground" />
          </button>
        </div>
      </nav>

      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            inert={!menuOpen}
            className={`md:hidden fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm transition-[opacity,visibility] duration-500 ease-out motion-reduce:transition-none ${
              menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between px-6 h-20 shrink-0">
              <span className="font-serif italic text-[26px] leading-none text-foreground">Filoména</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label={lang === "cs" ? "Zavřít menu" : "Close menu"}
                className="relative -mr-2.5 h-11 w-11 text-foreground"
              >
                <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </button>
            </div>

            <nav aria-label="Menu" className="flex flex-1 flex-col items-center justify-center gap-10 px-6">
              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms" }}
                  className={`font-serif text-5xl leading-none tracking-tight text-foreground transition-[opacity,transform,color] duration-700 ease-out hover:text-primary motion-reduce:transition-none ${
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div
              style={{ transitionDelay: menuOpen ? "450ms" : "0ms" }}
              className={`flex justify-center pb-[max(2.5rem,env(safe-area-inset-bottom))] transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={toggle}
                aria-label="Toggle language"
                className="px-4 py-2 text-sm tracking-[0.2em] text-muted-foreground"
              >
                <span className={lang === "cs" ? "text-foreground" : ""}>CZ</span>
                <span className="mx-2 text-muted-foreground/50">/</span>
                <span className={lang === "en" ? "text-foreground" : ""}>EN</span>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
