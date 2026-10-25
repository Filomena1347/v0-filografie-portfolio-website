'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useEventsAdmin } from './admin-context'

// Loaded on the first click, so visitors never download the login form.
const LoginDialog = dynamic(() => import('./login-dialog'), { ssr: false })

/** The accent dot in front of the eyebrow. Looks like a plain dot; opens the editor login. */
export function EditDot() {
  const { isAdmin, editing, startEditing } = useEventsAdmin()
  const [loginOpen, setLoginOpen] = useState(false)

  function handleClick() {
    if (!isAdmin) {
      setLoginOpen(true)
      return
    }
    if (!editing) startEditing()
  }

  return (
    <>
      <button
        type="button"
        aria-label="Edit"
        onClick={handleClick}
        className="relative block size-2 shrink-0 cursor-default appearance-none rounded-full border-0 bg-ev-accent p-0 before:absolute before:-inset-2 before:content-['']"
      />
      {loginOpen && <LoginDialog onClose={() => setLoginOpen(false)} />}
    </>
  )
}
