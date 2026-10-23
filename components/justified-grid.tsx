"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react"

const FALLBACK_RATIO = 4 / 5

/**
 * Splits items into rows so every row fills the full width exactly.
 * Dynamic programming picks the grouping whose row heights stay closest to `target`,
 * so landscape photos naturally take a row of their own on narrow screens while
 * portraits pair up, and the last row is balanced instead of left short.
 */
export function computeRows(ratios: number[], width: number, target: number): number[][] {
  const count = ratios.length
  if (count === 0 || width <= 0) return []

  const cost = new Array<number>(count + 1).fill(Number.POSITIVE_INFINITY)
  const from = new Array<number>(count + 1).fill(0)
  cost[0] = 0

  for (let end = 1; end <= count; end++) {
    let ratioSum = 0
    for (let start = end - 1; start >= 0; start--) {
      ratioSum += ratios[start]
      const rowHeight = width / ratioSum
      // Adding more items only makes the row shorter, so stop once it is too squat.
      if (rowHeight < target * 0.55 && start < end - 1) break
      const deviation = (rowHeight - target) / target
      const total = cost[start] + deviation * deviation
      if (total < cost[end]) {
        cost[end] = total
        from[end] = start
      }
    }
  }

  const rows: number[][] = []
  let end = count
  while (end > 0) {
    const start = from[end]
    rows.unshift(Array.from({ length: end - start }, (_, offset) => start + offset))
    end = start
  }
  return rows
}

function targetRowHeight(width: number) {
  return Math.min(340, Math.max(190, width * 0.27))
}

type RatioSource = { id: string; width?: number | null; height?: number | null }

/** Stored size wins; older uploads without one use the size measured after they load. */
export function useItemRatios() {
  const [measured, setMeasured] = useState<Record<string, number>>({})

  const getRatio = useCallback(
    (item: RatioSource) => {
      if (item.width && item.height) return item.width / item.height
      return measured[item.id] ?? FALLBACK_RATIO
    },
    [measured],
  )

  const reportSize = useCallback((id: string, width: number, height: number) => {
    if (!width || !height) return
    const ratio = width / height
    setMeasured((prev) => (prev[id] && Math.abs(prev[id] - ratio) < 0.001 ? prev : { ...prev, [id]: ratio }))
  }, [])

  return { getRatio, reportSize }
}

type JustifiedGridProps<T> = {
  items: T[]
  getKey: (item: T) => string
  getRatio: (item: T) => number
  /**
   * Called with the row-computed box style (width % + aspect ratio) for each item.
   * The caller owns the wrapper element, so it can attach drag handlers, overlays, etc.
   */
  renderItem: (item: T, index: number, boxStyle: React.CSSProperties) => ReactNode
}

export function JustifiedGrid<T>({ items, getKey, getRatio, renderItem }: JustifiedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setWidth((prev) => (Math.abs(prev - el.clientWidth) >= 1 ? el.clientWidth : prev))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const ratios = items.map(getRatio)
  const ratioKey = ratios.map((r) => r.toFixed(3)).join(",")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useMemo(() => computeRows(ratios, width, targetRowHeight(width)), [ratioKey, width])

  return (
    <div ref={containerRef} className="w-full">
      {rows.map((row) => {
        const rowSum = row.reduce((sum, index) => sum + ratios[index], 0)
        return (
          <div key={getKey(items[row[0]])} className="flex w-full">
            {row.map((index) => {
              const item = items[index]
              return renderItem(item, index, {
                width: `${(ratios[index] / rowSum) * 100}%`,
                aspectRatio: ratios[index],
              })
            })}
          </div>
        )
      })}
    </div>
  )
}
