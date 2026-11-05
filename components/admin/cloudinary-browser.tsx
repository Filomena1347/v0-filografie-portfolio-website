"use client"

import { useEffect, useMemo, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { Check, Loader2, Play, Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cloudinaryAssetKey } from "@/lib/cloudinary-assets"
import type { CloudinaryAsset, CloudinaryTypeFilter, ListAssetsResponse } from "@/lib/cloudinary-assets"

const TYPE_OPTIONS: { value: CloudinaryTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
]

async function fetchAssets(url: string): Promise<ListAssetsResponse> {
  const res = await fetch(url, { cache: "no-store" })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`)
  return data as ListAssetsResponse
}

type CloudinaryBrowserProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Which asset kinds the current section accepts. */
  allow: CloudinaryTypeFilter
  /** public_ids already present in the current list, shown as "Added". */
  existingIds: Set<string>
  /** Adds one asset to the current category/section. Throw to report a failure. */
  onAdd: (asset: CloudinaryAsset) => Promise<void>
}

export function CloudinaryBrowser({ open, onOpenChange, allow, existingIds, onAdd }: CloudinaryBrowserProps) {
  const [typeFilter, setTypeFilter] = useState<CloudinaryTypeFilter>("all")
  const [search, setSearch] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selected, setSelected] = useState<Map<string, CloudinaryAsset>>(new Map())
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [addError, setAddError] = useState("")

  const effectiveType = allow === "all" ? typeFilter : allow
  const adding = progress !== null

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(search.trim()), 350)
    return () => clearTimeout(timer)
  }, [search])

  const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite<ListAssetsResponse>(
    (_index, previous) => {
      if (!open || (previous && !previous.hasMore)) return null
      const params = new URLSearchParams({ type: effectiveType })
      if (debouncedQuery) params.set("q", debouncedQuery)
      if (previous) params.set("cursor", JSON.stringify(previous.cursor))
      return `/api/cloudinary/list-assets?${params}`
    },
    fetchAssets,
    { revalidateOnFocus: false, revalidateFirstPage: false },
  )

  const assets = useMemo(() => {
    const seen = new Set<string>()
    return (data ?? [])
      .flatMap((page) => page.assets)
      .filter((asset) => {
        const key = cloudinaryAssetKey(asset)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
  }, [data])

  const hasMore = data ? (data[data.length - 1]?.hasMore ?? false) : false
  const loadingMore = isValidating && size > (data?.length ?? 0)

  function handleOpenChange(next: boolean) {
    if (adding) return
    if (!next) {
      setSelected(new Map())
      setSearch("")
      setDebouncedQuery("")
      setAddError("")
    }
    onOpenChange(next)
  }

  function toggle(asset: CloudinaryAsset) {
    const key = cloudinaryAssetKey(asset)
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(key)) next.delete(key)
      else next.set(key, asset)
      return next
    })
  }

  async function addSelected() {
    const queue = [...selected.entries()]
    setAddError("")
    const added: string[] = []
    try {
      for (const [index, [key, asset]] of queue.entries()) {
        setProgress({ current: index + 1, total: queue.length })
        await onAdd(asset)
        added.push(key)
      }
      setSelected(new Map())
      setProgress(null)
      handleOpenChange(false)
    } catch (err) {
      setAddError((err as Error).message)
      setSelected((prev) => {
        const next = new Map(prev)
        added.forEach((key) => next.delete(key))
        return next
      })
      setProgress(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-4 border-ev-line bg-ev-bg text-ev-text sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Browse Cloudinary</DialogTitle>
          <DialogDescription className="text-ev-muted">
            Pick assets that are already uploaded and add them here. Nothing is uploaded again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ev-text/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search filename or folder"
              aria-label="Search filename or folder"
              className="w-full rounded-full border border-ev-line bg-ev-bg py-2 pl-9 pr-4 text-sm text-ev-text placeholder:text-ev-text/40 focus:border-ev-text focus:outline-none"
            />
          </div>
          {allow === "all" && (
            <div role="group" aria-label="Asset type" className="flex rounded-full border border-ev-line p-0.5">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={typeFilter === option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    typeFilter === option.value
                      ? "bg-ev-text text-ev-bg"
                      : "text-ev-text/60 hover:text-ev-text"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-64 flex-1 overflow-y-auto pr-1">
          {error ? (
            <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-ev-accent">{error.message}</p>
              <button
                type="button"
                onClick={() => mutate()}
                className="rounded-full border border-ev-line px-4 py-1.5 text-xs text-ev-text/70 transition-colors hover:text-ev-text"
              >
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-ev-text/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              {debouncedQuery ? "Searching Cloudinary…" : "Loading assets…"}
            </p>
          ) : assets.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ev-line py-10 text-center text-sm text-ev-text/50">
              {debouncedQuery ? "No assets match this search." : "No assets found in Cloudinary."}
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {assets.map((asset) => {
                  const key = cloudinaryAssetKey(asset)
                  const isSelected = selected.has(key)
                  const alreadyAdded = existingIds.has(asset.public_id)
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        disabled={alreadyAdded || adding}
                        onClick={() => toggle(asset)}
                        className="group block w-full text-left disabled:cursor-not-allowed"
                      >
                        <span
                          className={`relative block aspect-square overflow-hidden rounded-md bg-ev-soft ring-offset-2 ring-offset-ev-bg transition-shadow ${
                            isSelected ? "ring-2 ring-ev-text" : "group-hover:ring-1 group-hover:ring-ev-line"
                          } ${alreadyAdded ? "opacity-50" : ""}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.thumbnail_url || "/placeholder.svg"}
                            alt={asset.filename}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          {asset.kind === "video" && (
                            <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-ev-bg/80 px-2 py-0.5 text-[10px] text-ev-text backdrop-blur-sm">
                              <Play className="h-2.5 w-2.5" />
                              Video
                            </span>
                          )}
                          {isSelected && (
                            <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ev-text text-ev-bg">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                          {alreadyAdded && (
                            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ev-bg/80 py-0.5 text-center text-[10px] text-ev-text">
                              Already added
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block truncate text-xs text-ev-text" title={asset.public_id}>
                          {asset.filename}
                        </span>
                        {asset.folder && (
                          <span className="block truncate text-[11px] text-ev-text/50">{asset.folder}</span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setSize(size + 1)}
                    disabled={isValidating}
                    className="inline-flex items-center gap-2 rounded-full border border-ev-line px-5 py-1.5 text-xs text-ev-text/70 transition-colors hover:text-ev-text disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ev-line pt-3">
          <p aria-live="polite" className="text-xs text-ev-text/50">
            {selected.size > 0 ? `${selected.size} selected` : `${assets.length} loaded${hasMore ? ", more available" : ""}`}
            {addError && <span className="ml-3 text-ev-accent">{addError}</span>}
          </p>
          <div className="flex items-center gap-2">
            {selected.size > 0 && !adding && (
              <button
                type="button"
                onClick={() => setSelected(new Map())}
                className="rounded-full border border-ev-line px-4 py-1.5 text-xs text-ev-text/70 transition-colors hover:text-ev-text"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={addSelected}
              disabled={selected.size === 0 || adding}
              className="inline-flex items-center gap-2 rounded-full bg-ev-text px-5 py-1.5 text-xs font-medium text-ev-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {adding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {adding
                ? `Adding ${progress.current}/${progress.total}…`
                : selected.size > 0
                  ? `Add ${selected.size} selected`
                  : "Add selected"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
