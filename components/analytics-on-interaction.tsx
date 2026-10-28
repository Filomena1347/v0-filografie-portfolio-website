"use client"

import { useEffect } from "react"

const CLARITY_PROJECT_ID = "z25rjr1h1y"
const INTERACTION_EVENTS = ["mousemove", "scroll", "touchstart"] as const

type ClarityWindow = Window & {
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
}

function loadClarity() {
  const w = window as ClarityWindow
  if (w.clarity || document.getElementById("clarity-script")) return

  w.clarity = function (...args: unknown[]) {
    ;(w.clarity!.q = w.clarity!.q || []).push(args)
  }

  const script = document.createElement("script")
  script.id = "clarity-script"
  script.async = true
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
  document.head.appendChild(script)
}

async function loadVercelAnalytics() {
  if (process.env.NODE_ENV !== "production") return
  const { inject } = await import("@vercel/analytics")
  inject()
}

export function AnalyticsOnInteraction() {
  useEffect(() => {
    const options: AddEventListenerOptions = { passive: true }

    function removeListeners() {
      INTERACTION_EVENTS.forEach((type) =>
        window.removeEventListener(type, onFirstInteraction, options),
      )
    }

    function onFirstInteraction() {
      removeListeners()
      loadClarity()
      void loadVercelAnalytics()
    }

    INTERACTION_EVENTS.forEach((type) =>
      window.addEventListener(type, onFirstInteraction, options),
    )

    return removeListeners
  }, [])

  return null
}
