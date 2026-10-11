"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const POLL_INTERVAL_MS = 30_000

/** Re-fetches server-rendered media so open tabs pick up admin changes without a manual reload. */
export function LiveRefresh() {
  const router = useRouter()

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") router.refresh()
    }
    const interval = window.setInterval(refreshIfVisible, POLL_INTERVAL_MS)
    window.addEventListener("focus", refreshIfVisible)
    document.addEventListener("visibilitychange", refreshIfVisible)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", refreshIfVisible)
      document.removeEventListener("visibilitychange", refreshIfVisible)
    }
  }, [router])

  return null
}
