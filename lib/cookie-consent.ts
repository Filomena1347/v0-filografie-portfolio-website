import { useSyncExternalStore } from "react"

const STORAGE_KEY = "cookie_consent"

export type ConsentState = "all" | "none" | "unknown"

const listeners = new Set<() => void>()
let editing = false

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function readConsent(): ConsentState {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === "all" ? "all" : "none"
  } catch {
    return "none"
  }
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => "unknown")
}

export function useBannerEditing(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => editing,
    () => false,
  )
}

export function openCookieBanner() {
  editing = true
  emit()
}

export function saveConsent() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "all")
  } catch {
    // Storage blocked: the choice only lasts until the next reload.
  }
  editing = false
  emit()
}
