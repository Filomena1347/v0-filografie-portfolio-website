"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"

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
    <section id="contact" className="bg-secondary/40 py-12 sm:py-20 md:py-28 scroll-mt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.contact_label}</p>
        <h2 className="font-serif text-4xl md:text-6xl text-foreground">{t.contact_title}</h2>
        <p className="mt-4 text-foreground/60 leading-relaxed">{t.contact_desc}</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 text-left">
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
      </div>
    </section>
  )
}
