"use client"

import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-serif italic text-2xl text-foreground">Filoména</p>
          <p className="mt-2 text-sm text-foreground/60 max-w-sm">{t.footer_tagline}</p>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <p className="text-xs text-foreground/50">
            © {year} Filografie. {t.footer_rights}
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-foreground/30 hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
