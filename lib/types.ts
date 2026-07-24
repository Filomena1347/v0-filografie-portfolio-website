export type MediaType = 'video' | 'photo'

export interface MediaItem {
  id: string
  type: MediaType
  title: string | null
  src: string
  thumbnail_url: string | null
  category: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}
