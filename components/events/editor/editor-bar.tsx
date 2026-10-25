'use client'

import { useState } from 'react'
import { useEventsAdmin } from '../admin-context'

export default function EditorBar() {
  const { uploading, stopEditing, logOut } = useEventsAdmin()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogOut() {
    setLoggingOut(true)
    await logOut()
  }

  const busyTitle = uploading ? 'Wait for the uploads to finish' : undefined

  return (
    <div
      role="region"
      aria-label="Page editor"
      className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-5 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-ev-text p-1.5 pl-5 text-ev-bg shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <span className="mr-3 flex items-center gap-2 text-[13px] uppercase tracking-[0.12em]">
          <span aria-hidden="true" className="size-2 rounded-full bg-ev-accent" />
          Editing
        </span>
        <button
          type="button"
          onClick={stopEditing}
          disabled={uploading}
          title={busyTitle}
          className="h-9 rounded-full bg-ev-bg px-4 text-[13px] font-medium text-ev-text transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Done
        </button>
        <button
          type="button"
          onClick={handleLogOut}
          disabled={uploading || loggingOut}
          title={busyTitle}
          className="h-9 rounded-full px-4 text-[13px] transition-colors hover:bg-white/15 disabled:opacity-50"
        >
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  )
}
