"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AdminLoginDot() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError("Nesprávné heslo")
        setLoading(false)
        return
      }
      window.location.assign("/admin")
    } catch {
      setError("Něco se pokazilo")
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setPassword("")
          setError("")
          setLoading(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Admin"
          className="inline cursor-text border-0 bg-transparent p-0 [font:inherit] [color:inherit] focus:outline-none focus-visible:text-primary"
        >
          .
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border-border bg-card p-8 sm:rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogTitle className="font-serif italic text-3xl font-normal text-foreground text-center">
            Filoména
          </DialogTitle>
          <DialogDescription className="mt-1 mb-6 text-center text-sm text-foreground/50">
            Přihlášení do administrace
          </DialogDescription>

          <label className="block text-sm text-foreground/70 mb-2" htmlFor="admin-dot-password">
            Heslo
          </label>
          <input
            id="admin-dot-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Přihlašuji…" : "Přihlásit"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
