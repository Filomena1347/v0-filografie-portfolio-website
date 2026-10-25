'use client'

import { useEffect, useRef, useState } from 'react'
import { useEventsAdmin } from './admin-context'

export default function LoginDialog({ onClose }: { onClose: () => void }) {
  const { loggedIn } = useEventsAdmin()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (submitting || !password) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        cache: 'no-store',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(res.status === 401 ? 'Wrong password.' : (data.error ?? 'Could not sign in.'))
        setSubmitting(false)
        return
      }
      onClose()
      loggedIn()
    } catch {
      setError('Network error. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="ev-login-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
      className="m-auto w-[calc(100%-40px)] max-w-sm rounded-[4px] border border-ev-line bg-ev-bg p-0 text-ev-text shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop:bg-black/40"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
        <div>
          <h2 id="ev-login-title" className="font-display text-3xl leading-none">
            Sign in
          </h2>
          <p className="mt-3 text-sm text-ev-muted">Enter the password to edit this page.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ev-login-password" className="text-[13px] uppercase tracking-[0.12em] text-ev-muted">
            Password
          </label>
          <input
            id="ev-login-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'ev-login-error' : undefined}
            className="h-11 rounded-[4px] border border-ev-line bg-ev-bg px-3 text-base outline-none focus:border-ev-text"
          />
          {error && (
            <p id="ev-login-error" role="alert" className="text-sm text-ev-accent">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !password}
            className="h-11 flex-1 rounded-full bg-ev-text px-5 text-sm font-medium text-ev-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="h-11 rounded-full border border-ev-line px-5 text-sm transition-colors hover:border-ev-text"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}
