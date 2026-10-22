"use client"

import { useState } from "react"
import { FolderInput, Trash2, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CATEGORY_KEYS, CATEGORY_LABELS } from "@/lib/media"
import type { CategoryKey } from "@/lib/media"

type BulkActionBarProps = {
  count: number
  busy: boolean
  currentCategory: CategoryKey | "all"
  onDelete: () => void
  onMove: (category: CategoryKey) => void
  onClear: () => void
}

function photoCountLabel(count: number) {
  if (count === 1) return "1 fotka"
  if (count >= 2 && count <= 4) return `${count} fotky`
  return `${count} fotek`
}

export function BulkActionBar({ count, busy, currentCategory, onDelete, onMove, onClear }: BulkActionBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [target, setTarget] = useState<CategoryKey | "">("")

  const targets = CATEGORY_KEYS.filter((key) => key !== currentCategory)
  const removeOnly = currentCategory === "all"

  return (
    <>
      <div
        role="region"
        aria-label="Hromadné akce"
        className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[calc(100%-2rem)] max-w-3xl flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg"
      >
        <p className="mr-auto text-sm font-medium text-foreground" aria-live="polite">
          Vybráno: {photoCountLabel(count)}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="bulk-move-target" className="sr-only">
            Cílová kategorie
          </label>
          <select
            id="bulk-move-target"
            value={target}
            onChange={(e) => setTarget(e.target.value as CategoryKey | "")}
            disabled={busy}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground"
          >
            <option value="">Vyberte kategorii…</option>
            {targets.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => target && onMove(target)}
            disabled={busy || !target}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-1.5 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <FolderInput className="h-3.5 w-3.5" />
            Přesunout do kategorie
          </button>
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 ${
            removeOnly ? "bg-primary text-primary-foreground" : "bg-destructive text-primary-foreground"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {removeOnly ? "Odebrat z Vše" : "Smazat vybrané"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={busy}
          aria-label="Zrušit výběr"
          className="rounded-full p-1.5 text-foreground/60 transition-colors hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{removeOnly ? "Odebrat vybrané ze sekce Vše?" : "Smazat vybrané položky?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {removeOnly
                ? `${photoCountLabel(count)} zmizí ze sekce Vše, ale zůstane ve své kategorii. Vrátit ji lze přepínačem „Zobrazit ve Vše“ v původní kategorii.`
                : `Trvale se smaže ${photoCountLabel(count)} včetně souborů na Cloudinary. Tuto akci nelze vrátit zpět.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false)
                onDelete()
              }}
              className={
                removeOnly
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-destructive text-primary-foreground hover:bg-destructive/90"
              }
            >
              {removeOnly ? "Odebrat" : "Smazat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
