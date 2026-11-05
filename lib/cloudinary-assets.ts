export type CloudinaryAssetKind = "image" | "video"
export type CloudinaryTypeFilter = CloudinaryAssetKind | "all"

export type CloudinaryAsset = {
  public_id: string
  kind: CloudinaryAssetKind
  format: string
  /** Original, untransformed delivery URL. */
  url: string
  thumbnail_url: string
  width: number | null
  height: number | null
  bytes: number | null
  created_at: string
  folder: string
  filename: string
}

/**
 * Per-kind paging state for the Admin API. A missing key means "not started yet",
 * a string is the next cursor and `null` means that kind is exhausted.
 */
export type CloudinaryCursor = Partial<Record<CloudinaryAssetKind, string | null>>

export type ListAssetsResponse = {
  assets: CloudinaryAsset[]
  cursor: CloudinaryCursor
  hasMore: boolean
}

export function cloudinaryAssetKey(asset: Pick<CloudinaryAsset, "kind" | "public_id">) {
  return `${asset.kind}:${asset.public_id}`
}
