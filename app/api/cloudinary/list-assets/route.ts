import { NextResponse } from "next/server"
import { isAuthed } from "@/lib/auth"
import type {
  CloudinaryAsset,
  CloudinaryAssetKind,
  CloudinaryCursor,
  ListAssetsResponse,
} from "@/lib/cloudinary-assets"

export const dynamic = "force-dynamic"

const BROWSE_PAGE_SIZE = 60
const SEARCH_PAGE_SIZE = 500
const SEARCH_TARGET_RESULTS = 48
const SEARCH_MAX_ROUNDS = 8
const KINDS: CloudinaryAssetKind[] = ["image", "video"]

type RawResource = {
  public_id: string
  format?: string
  created_at?: string
  bytes?: number
  width?: number
  height?: number
  secure_url?: string
  asset_folder?: string
  display_name?: string
}

type Credentials = { cloudName: string; apiKey: string; apiSecret: string }

class CloudinaryRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

function readCredentials(): Credentials | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null
}

function parseCursor(raw: string | null): CloudinaryCursor {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown> | null
    const cursor: CloudinaryCursor = {}
    for (const kind of KINDS) {
      const value = parsed?.[kind]
      if (typeof value === "string" || value === null) cursor[kind] = value
    }
    return cursor
  } catch {
    return {}
  }
}

async function fetchPage(
  kind: CloudinaryAssetKind,
  cursor: string | undefined,
  pageSize: number,
  { cloudName, apiKey, apiSecret }: Credentials,
) {
  const params = new URLSearchParams({ type: "upload", max_results: String(pageSize), direction: "desc" })
  if (cursor) params.set("next_cursor", cursor)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/${kind}?${params}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}` },
    cache: "no-store",
  })
  const data = (await res.json().catch(() => null)) as {
    resources?: RawResource[]
    next_cursor?: string
    error?: { message?: string }
  } | null

  if (!res.ok) {
    const detail =
      res.status === 420 || res.status === 429
        ? "Cloudinary rate limit reached, try again later"
        : (data?.error?.message ?? `HTTP ${res.status}`)
    throw new CloudinaryRequestError(detail, res.status)
  }
  return { resources: data?.resources ?? [], next: data?.next_cursor ?? null }
}

function thumbnailFor(kind: CloudinaryAssetKind, secureUrl: string) {
  const marker = "/upload/"
  const index = secureUrl.indexOf(marker)
  if (index === -1) return secureUrl
  const head = secureUrl.slice(0, index + marker.length)
  const tail = secureUrl.slice(index + marker.length)
  return kind === "video"
    ? `${head}so_0,c_fill,w_400,h_400,q_auto/${tail.replace(/\.[^/.]+$/, ".jpg")}`
    : `${head}c_fill,w_400,h_400,q_auto,f_auto/${tail}`
}

function toAsset(kind: CloudinaryAssetKind, resource: RawResource, cloudName: string): CloudinaryAsset | null {
  const { public_id: publicId } = resource
  if (!publicId) return null
  const url =
    resource.secure_url ??
    `https://res.cloudinary.com/${cloudName}/${kind}/upload/${publicId}${resource.format ? `.${resource.format}` : ""}`
  const slash = publicId.lastIndexOf("/")

  return {
    public_id: publicId,
    kind,
    format: resource.format ?? "",
    url,
    thumbnail_url: thumbnailFor(kind, url),
    width: resource.width ?? null,
    height: resource.height ?? null,
    bytes: resource.bytes ?? null,
    created_at: resource.created_at ?? "",
    folder: resource.asset_folder ?? (slash === -1 ? "" : publicId.slice(0, slash)),
    filename: resource.display_name ?? publicId.slice(slash + 1),
  }
}

function matchesQuery(asset: CloudinaryAsset, query: string) {
  return `${asset.public_id} ${asset.filename} ${asset.folder}`.toLowerCase().includes(query)
}

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const credentials = readCredentials()
  if (!credentials) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)." },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const typeParam = searchParams.get("type")
  const kinds: CloudinaryAssetKind[] = typeParam === "image" || typeParam === "video" ? [typeParam] : KINDS
  const query = (searchParams.get("q") ?? "").trim().toLowerCase()
  const cursor = parseCursor(searchParams.get("cursor"))

  // The Admin API can only list; a text filter means scanning pages until enough matches are found.
  const pageSize = query ? SEARCH_PAGE_SIZE : BROWSE_PAGE_SIZE
  const maxRounds = query ? SEARCH_MAX_ROUNDS : 1
  const state: CloudinaryCursor = Object.fromEntries(kinds.map((kind) => [kind, cursor[kind]]))
  const assets: CloudinaryAsset[] = []

  try {
    for (let round = 0; round < maxRounds; round++) {
      const active = kinds.filter((kind) => state[kind] !== null)
      if (active.length === 0 || (query && assets.length >= SEARCH_TARGET_RESULTS)) break

      const pages = await Promise.all(
        active.map((kind) => fetchPage(kind, state[kind] ?? undefined, pageSize, credentials)),
      )
      pages.forEach((page, index) => {
        const kind = active[index]
        state[kind] = page.next
        for (const resource of page.resources) {
          const asset = toAsset(kind, resource, credentials.cloudName)
          if (asset && (!query || matchesQuery(asset, query))) assets.push(asset)
        }
      })
    }
  } catch (err) {
    const status = err instanceof CloudinaryRequestError ? err.status : 0
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[cloudinary] list-assets failed:", status, message)
    return NextResponse.json({ error: `Cloudinary: ${message}` }, { status: 502 })
  }

  assets.sort((a, b) => b.created_at.localeCompare(a.created_at))
  const body: ListAssetsResponse = {
    assets,
    cursor: state,
    hasMore: kinds.some((kind) => state[kind] !== null),
  }
  return NextResponse.json(body)
}
