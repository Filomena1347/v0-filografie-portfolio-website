"use client"

import { Analytics } from "@vercel/analytics/next"
import ClarityScript from "@/components/ClarityScript"
import { saveConsent, useBannerEditing, useConsent } from "@/lib/cookie-consent"

export function CookieConsent() {
  const consent = useConsent()
  const editing = useBannerEditing()

  const showBanner = consent !== "unknown" && (consent === "none" || editing)

  return (
    <>
      {consent === "all" && (
        <>
          <ClarityScript />
          {process.env.NODE_ENV === "production" && <Analytics />}
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookies"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-border bg-background p-4 text-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <p className="text-sm leading-relaxed text-pretty">
              This site uses cookies.
            </p>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={saveConsent}
                className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={saveConsent}
                className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
