export type EventPhoto = {
  id: string
  src: string
  width: number
  height: number
  alt: string
}

export type EventVideo = {
  id: string
  title: string
  /** Video file URL. Leave empty while using placeholders. */
  src: string
  poster: { src: string; width: number; height: number }
}

/** Soft grey box used until real uploads are connected. */
function placeholderImage(width: number, height: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#F1F1F0"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const photoSizes: Array<[number, number]> = [
  [1200, 800],
  [800, 1200],
  [1000, 1250],
  [1200, 1200],
  [1600, 900],
  [900, 1200],
  [1200, 900],
  [800, 1200],
  [1200, 800],
  [1000, 1250],
]

export const eventPhotos: EventPhoto[] = photoSizes.map(([width, height], index) => ({
  id: `photo-${index + 1}`,
  src: placeholderImage(width, height),
  width,
  height,
  alt: `Event photo ${index + 1}`,
}))

export const eventVideos: EventVideo[] = [1, 2, 3].map((n) => ({
  id: `video-${n}`,
  title: `Event reel ${n}`,
  src: '',
  poster: { src: placeholderImage(720, 1280), width: 720, height: 1280 },
}))
