"use client"

import { createElement } from "react"
import Script from "next/script"
import { useLanguage } from "@/context/language-context"

// Replace with the feed ID from your Behold dashboard (https://behold.so).
// Grid layout, number of posts (6-9) and click-through to Instagram are configured there.
const BEHOLD_FEED_ID = "REPLACE_WITH_BEHOLD_FEED_ID"

const isConfigured = BEHOLD_FEED_ID !== "REPLACE_WITH_BEHOLD_FEED_ID"

export function InstagramFeed() {
  const { t } = useLanguage()

  return (
    <div className="mt-20 md:mt-24 border-t border-border pt-16">
      <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3 text-center">{t.contact_feed_label}</p>
      <h3 className="font-serif text-3xl md:text-4xl text-foreground text-center">{t.contact_feed_title}</h3>

      <div className="mt-10">
        {isConfigured ? (
          <>
            {createElement("behold-widget", { "feed-id": BEHOLD_FEED_ID })}
            <Script src="https://w.behold.so/widget.js" type="module" strategy="lazyOnload" />
          </>
        ) : (
          <div
            id="behold-widget-placeholder"
            className="rounded-lg border border-dashed border-border bg-background/60 px-6 py-16 text-center text-sm text-foreground/50"
          >
            {t.contact_feed_placeholder}
          </div>
        )}
      </div>
    </div>
  )
}
