const IMAGE_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/

/** Widest image the site ever asks Cloudinary for. */
export const THUMBNAIL_WIDTH = 800
export const FULL_WIDTH = 1200

export function isCloudinaryImageUrl(url: string) {
  return IMAGE_UPLOAD.test(url)
}

function isTransformation(segment: string) {
  return /^[a-z]{1,3}_[^/]*$/.test(segment)
}

function isFormatQualityWidthOnly(segment: string) {
  return segment.split(",").every((part) => /^(f|q|w)_/.test(part))
}

/**
 * Adds `f_auto,q_auto,w_<width>` to a Cloudinary image URL so browsers get WebP/AVIF at the right size.
 * Non-Cloudinary URLs are returned untouched. An existing f/q/w-only transformation is replaced;
 * any other one (a crop, for example) is kept and the optimization is applied after it.
 */
export function cloudinaryImageUrl(url: string, width: number) {
  const match = IMAGE_UPLOAD.exec(url)
  if (!match) return url

  const [, base, rest] = match
  const optimize = `f_auto,q_auto,w_${Math.round(width)}`
  const [first] = rest.split("/")

  if (!isTransformation(first)) return `${base}${optimize}/${rest}`
  const tail = rest.slice(first.length + 1)
  return isFormatQualityWidthOnly(first)
    ? `${base}${optimize}/${tail}`
    : `${base}${first}/${optimize}/${tail}`
}
