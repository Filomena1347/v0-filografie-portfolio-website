"use client"

import { openCookieBanner } from "@/lib/cookie-consent"

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openCookieBanner}
      className="underline-offset-2 hover:underline focus-visible:underline"
    >
      Cookie settings
    </button>
  )
}
