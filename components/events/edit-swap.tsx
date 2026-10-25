'use client'

import dynamic from 'next/dynamic'
import { useEventsAdmin } from './admin-context'
import { PhotoGridSkeleton, ReelListSkeleton } from './skeletons'

// Editor code is split out and only downloaded when an admin starts editing.
const PhotoEditor = dynamic(() => import('./editor/photo-editor'), {
  ssr: false,
  loading: () => <PhotoGridSkeleton />,
})
const VideoEditor = dynamic(() => import('./editor/video-editor'), {
  ssr: false,
  loading: () => <ReelListSkeleton />,
})

/** Shows the visitor layout, or the editable version of the same layout while editing. */
export function EditSwap({ type, children }: { type: 'photo' | 'video'; children: React.ReactNode }) {
  const { isAdmin, editing } = useEventsAdmin()
  if (!isAdmin || !editing) return children
  return type === 'photo' ? <PhotoEditor /> : <VideoEditor />
}
