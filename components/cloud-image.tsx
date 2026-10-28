"use client"

import Image, { type ImageLoaderProps, type ImageProps } from "next/image"
import { cloudinaryImageUrl, FULL_WIDTH, isCloudinaryImageUrl, THUMBNAIL_WIDTH } from "@/lib/cloudinary-url"

type CloudImageProps = Omit<ImageProps, "loader"> & {
  /** Largest width requested from Cloudinary: 800 for gallery thumbnails, 1200 for full-width photos. */
  maxWidth?: typeof THUMBNAIL_WIDTH | typeof FULL_WIDTH
}

const loaders = new Map<number, (props: ImageLoaderProps) => string>()

function cloudinaryLoader(maxWidth: number) {
  let loader = loaders.get(maxWidth)
  if (!loader) {
    loader = ({ src, width }) => cloudinaryImageUrl(src, Math.min(width, maxWidth))
    loaders.set(maxWidth, loader)
  }
  return loader
}

/**
 * next/image that lets Cloudinary do the resizing: the `sizes` prop still drives the srcset,
 * but each candidate points at a `f_auto,q_auto,w_N` Cloudinary URL instead of the Next optimizer.
 */
export function CloudImage({ maxWidth = THUMBNAIL_WIDTH, ...props }: CloudImageProps) {
  const { src } = props
  if (typeof src === "string") {
    if (isCloudinaryImageUrl(src)) {
      // The src itself is already optimized, so the f_auto,q_auto,w_N URL is used even where the
      // loader is bypassed (unoptimized builds, previews); the loader then adds the responsive widths.
      return <Image {...props} src={cloudinaryImageUrl(src, maxWidth)} loader={cloudinaryLoader(maxWidth)} />
    }
    // Remote hosts that are not configured for the Next optimizer must not go through it.
    if (!src.startsWith("/")) return <Image {...props} unoptimized />
  }
  return <Image {...props} />
}
