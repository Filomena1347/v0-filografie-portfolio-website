"use client"

import { useState, type Ref } from "react"
import Image, { type ImageLoaderProps, type ImageProps } from "next/image"
import { cloudinaryImageUrl, FULL_WIDTH, isCloudinaryImageUrl, THUMBNAIL_WIDTH } from "@/lib/cloudinary-url"

type CloudImageProps = Omit<ImageProps, "loader"> & {
  /** Largest width requested from Cloudinary: 800 for gallery thumbnails, 1200 for full-width photos. */
  maxWidth?: typeof THUMBNAIL_WIDTH | typeof FULL_WIDTH
  ref?: Ref<HTMLImageElement>
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

function isUsableSrc(src: ImageProps["src"] | null | undefined) {
  if (!src) return false
  if (typeof src !== "string") return true
  const trimmed = src.trim()
  if (!trimmed) return false
  return trimmed.startsWith("/") || trimmed.startsWith("data:") || /^https?:\/\//i.test(trimmed)
}

function aspectRatioOf(width: ImageProps["width"], height: ImageProps["height"]) {
  const w = Number(width)
  const h = Number(height)
  return w > 0 && h > 0 ? `${w} / ${h}` : "3 / 2"
}

function ImagePlaceholder({ alt, width, height, className }: Pick<ImageProps, "alt" | "width" | "height" | "className">) {
  return (
    <div
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`bg-ev-soft ${className ?? ""}`}
      style={{ aspectRatio: aspectRatioOf(width, height), width: "100%" }}
    />
  )
}

/**
 * next/image that lets Cloudinary do the resizing: the `sizes` prop still drives the srcset,
 * but each candidate points at a `f_auto,q_auto,w_N` Cloudinary URL instead of the Next optimizer.
 *
 * It never throws for a bad source: an empty or malformed `src`, or an image that fails to load,
 * renders a neutral placeholder of the same size instead of crashing the surrounding tree.
 */
export function CloudImage({ maxWidth = THUMBNAIL_WIDTH, onError, ...props }: CloudImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null)
  const { src, alt, width, height, className } = props

  if (!isUsableSrc(src) || failedSrc === src) {
    return <ImagePlaceholder alt={alt} width={width} height={height} className={className} />
  }

  const handleError: ImageProps["onError"] = (event) => {
    setFailedSrc(src)
    onError?.(event)
  }

  if (typeof src === "string") {
    if (isCloudinaryImageUrl(src)) {
      // The src itself is already optimized, so the f_auto,q_auto,w_N URL is used even where the
      // loader is bypassed (unoptimized builds, previews); the loader then adds the responsive widths.
      return (
        <Image
          {...props}
          src={cloudinaryImageUrl(src, maxWidth)}
          loader={cloudinaryLoader(maxWidth)}
          onError={handleError}
        />
      )
    }
    // Our own /api/media route already serves a resized image, and remote hosts that are not
    // configured for the Next optimizer must not go through it either. Local URLs with a query
    // string are not accepted by the optimizer without extra configuration.
    if (src.startsWith("/") || !src.startsWith("data:")) {
      return <Image {...props} unoptimized onError={handleError} />
    }
  }
  return <Image {...props} onError={handleError} />
}
