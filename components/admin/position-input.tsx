"use client"

import { useEffect, useState } from "react"

type PositionInputProps = {
  position: number
  total: number
  onCommit: (position: number) => void
  className?: string
}

export function PositionInput({ position, total, onCommit, className = "" }: PositionInputProps) {
  const [draft, setDraft] = useState(String(position))

  useEffect(() => {
    setDraft(String(position))
  }, [position])

  function commit(input: HTMLInputElement) {
    const value = Number.parseInt(draft, 10)
    if (Number.isNaN(value)) {
      setDraft(String(position))
      return
    }
    const clamped = Math.min(Math.max(1, value), total)
    setDraft(String(clamped))
    if (clamped !== position) onCommit(clamped)
    input.blur()
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={total}
      value={draft}
      aria-label={`Pozice (1 až ${total})`}
      title="Napište pozici a stiskněte Enter"
      draggable
      onDragStart={(e) => {
        // Stops the surrounding card from starting a drag when the user selects the number.
        e.preventDefault()
        e.stopPropagation()
      }}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => setDraft(String(position))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          commit(e.currentTarget)
        } else if (e.key === "Escape") {
          setDraft(String(position))
          e.currentTarget.blur()
        }
      }}
      className={`h-8 w-12 rounded-full bg-background/85 text-center text-xs text-foreground backdrop-blur-sm [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className}`}
    />
  )
}
