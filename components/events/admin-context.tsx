'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

type MediaKind = 'photo' | 'video'

type EventsAdminValue = {
  isAdmin: boolean
  editing: boolean
  uploading: boolean
  startEditing: () => void
  stopEditing: () => void
  loggedIn: () => void
  logOut: () => Promise<void>
  sessionExpired: () => void
  setUploading: (kind: MediaKind, value: boolean) => void
}

const EventsAdminContext = createContext<EventsAdminValue | null>(null)

// The editor bar is only downloaded once someone is editing.
const EditorBar = dynamic(() => import('./editor/editor-bar'), { ssr: false })

export function useEventsAdmin() {
  const value = useContext(EventsAdminContext)
  if (!value) throw new Error('useEventsAdmin must be used inside EventsAdminProvider')
  return value
}

export function EventsAdminProvider({
  isAdmin: initialIsAdmin,
  children,
}: {
  isAdmin: boolean
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  const [editing, setEditing] = useState(false)
  const [uploads, setUploads] = useState<Record<MediaKind, boolean>>({ photo: false, video: false })

  const startEditing = useCallback(() => setEditing(true), [])

  const stopEditing = useCallback(() => {
    setEditing(false)
    router.refresh()
  }, [router])

  const loggedIn = useCallback(() => {
    setIsAdmin(true)
    setEditing(true)
    router.refresh()
  }, [router])

  const sessionExpired = useCallback(() => {
    setIsAdmin(false)
    setEditing(false)
    router.refresh()
  }, [router])

  const logOut = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST', redirect: 'manual', cache: 'no-store' }).catch(() => {})
    setIsAdmin(false)
    setEditing(false)
    router.refresh()
  }, [router])

  const setUploading = useCallback((kind: MediaKind, value: boolean) => {
    setUploads((prev) => (prev[kind] === value ? prev : { ...prev, [kind]: value }))
  }, [])

  const uploading = uploads.photo || uploads.video

  const value = useMemo<EventsAdminValue>(
    () => ({
      isAdmin,
      editing,
      uploading,
      startEditing,
      stopEditing,
      loggedIn,
      logOut,
      sessionExpired,
      setUploading,
    }),
    [isAdmin, editing, uploading, startEditing, stopEditing, loggedIn, logOut, sessionExpired, setUploading],
  )

  return (
    <EventsAdminContext.Provider value={value}>
      {children}
      {isAdmin && editing && <EditorBar />}
    </EventsAdminContext.Provider>
  )
}
