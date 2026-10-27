"use client"

import { useState } from "react"
import { Mail, Phone } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { InstagramIcon, WhatsAppIcon } from "@/components/brand-icons"
import { InstagramFeed } from "@/components/instagram-feed"

export function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="bg-secondary/40 py-20 md:py-28 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.contact_label}</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground">{t.contact_title}</h2>
          <p className="mt-4 text-foreground/60 leading-relaxed">{t.contact_desc}</p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          <li>
            <a
              href="mailto:info@filography.cz"
              className="group flex h-full items-center gap-4 rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="flex shrink-0 items-center gap-2 text-primary">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-xs tracking-wide text-foreground/50">{t.contact_email_label}</span>
                <span className="truncate text-foreground group-hover:text-primary transition-colors">
                  info@filography.cz
                </span>
              </span>
            </a>
          </li>

          <li>
            <a
              href="https://wa.me/420604889980"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-4 rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="flex shrink-0 items-center gap-2">
                <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                <WhatsAppIcon className="h-6 w-6 text-white" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-xs tracking-wide text-foreground/50">{t.contact_phone_label}</span>
                <span className="truncate text-foreground group-hover:text-primary transition-colors">
                  604 889 980
                </span>
              </span>
            </a>
          </li>

          <li>
            <a
              href="https://www.instagram.com/filografka/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-4 rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="flex shrink-0 items-center gap-2 text-primary">
                <InstagramIcon className="h-6 w-6" />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-xs tracking-wide text-foreground/50">{t.contact_instagram_label}</span>
                <span className="truncate text-foreground group-hover:text-primary transition-colors">
                  @filografka
                </span>
              </span>
            </a>
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="mt-12 max-w-2xl mx-auto flex flex-col gap-4 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder={t.contact_name}
              className="rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t.contact_email}
              className="rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={t.contact_message}
            className="rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none resize-none"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="self-start rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {status === "sending" ? t.contact_sending : t.contact_send}
          </button>

          {status === "success" && <p className="text-sm text-primary">{t.contact_success}</p>}
          {status === "error" && <p className="text-sm text-destructive">{t.contact_error}</p>}
        </form>

        <InstagramFeed />
      </div>
    </section>
  )
}
