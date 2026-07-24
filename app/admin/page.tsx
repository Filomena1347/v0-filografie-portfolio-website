"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Upload, X, ImagePlus, CheckCircle } from "lucide-react"

// Default hero gallery images (same as hero.tsx)
const DEFAULT_IMAGES = [
  { id: "1", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", alt: "Portrait photography" },
  { id: "2", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png", alt: "Lifestyle photography" },
  { id: "3", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154203/Sni%CC%81mek_obrazovky_2026-05-30_v_17.16.18_xfoggt.png", alt: "Event photography" },
  { id: "4", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154159/Sni%CC%81mek_obrazovky_2026-05-30_v_17.15.41_wfowzq.png", alt: "Food photography" },
  { id: "5", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147813/Sni%CC%81mek_obrazovky_2026-05-29_v_12.33.50_d3lite.png", alt: "Wedding photography" },
  { id: "6", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154527/Sni%CC%81mek_obrazovky_2026-05-30_v_17.21.54_uhziv7.png", alt: "Product photography" },
  { id: "7", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154249/Sni%CC%81mek_obrazovky_2026-05-30_v_17.17.06_smki1b.png", alt: "Fashion photography" },
  { id: "8", src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780155677/Sni%CC%81mek_obrazovky_2026-05-30_v_17.41.00_symplk.png", alt: "Commercial photography" },
]

type GalleryImage = { id: string; src: string; alt: string }

// Sortable image card
function SortableImage({
  image,
  onDelete,
}: {
  image: GalleryImage
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-[#111118] rounded-xl overflow-hidden border border-white/10 aspect-[4/5]"
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-contain bg-[#0a0a0f]"
      />

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Delete button */}
      <button
        onClick={() => onDelete(image.id)}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        aria-label="Delete image"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Position badge */}
      <div className="absolute bottom-2 left-2 text-xs text-white/40 bg-black/50 px-2 py-0.5 rounded-full">
        #{image.id}
      </div>
    </div>
  )
}

// Cloudinary Upload Widget
function CloudinaryUploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const [url, setUrl] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!url.trim()) { setError("Please enter a URL"); return }
    if (!url.startsWith("http")) { setError("Must be a valid URL"); return }
    onUpload(url.trim())
    setUrl("")
    setIsOpen(false)
    setError("")
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
      >
        <ImagePlus className="w-4 h-4" />
        Add Photo
      </button>
    )
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-[#111118] border border-white/10 rounded-xl">
      <div className="flex-1">
        <label className="text-xs text-white/50 mb-1.5 block">Cloudinary image URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError("") }}
          placeholder="https://res.cloudinary.com/..."
          className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit() }}
          autoFocus
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => { setIsOpen(false); setUrl(""); setError("") }}
          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_IMAGES)
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDelete = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  const handleUpload = useCallback((url: string) => {
    const newId = String(Date.now())
    setImages((prev) => [
      ...prev,
      { id: newId, src: url, alt: "Hero gallery photo" },
    ])
  }, [])

  const handleSave = () => {
    // In a real app this would persist to a DB / CMS.
    // Here we just show a success flash to demonstrate the intent.
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Filoména · Admin</p>
          <h1 className="font-serif text-2xl text-white">Hero Gallery Manager</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Saved!
            </span>
          )}
          <a
            href="/"
            className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-xl transition-colors"
          >
            View site
          </a>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Save order
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Instructions */}
        <div className="mb-8 p-5 bg-[#111118] border border-white/10 rounded-2xl">
          <h2 className="text-sm font-medium text-white mb-2">How to use</h2>
          <ul className="text-sm text-white/50 space-y-1 list-disc list-inside">
            <li>Drag photos using the <span className="text-white/70">grip handle</span> to reorder them.</li>
            <li>Click <span className="text-white/70">Add Photo</span> and paste a Cloudinary URL to add a new image.</li>
            <li>Hover a card and click the <span className="text-red-400">red trash icon</span> to delete.</li>
            <li>Click <span className="text-white/70">Save order</span> to confirm changes.</li>
          </ul>
        </div>

        {/* Add photo button */}
        <div className="mb-8">
          <CloudinaryUploadButton onUpload={handleUpload} />
        </div>

        {/* Sortable grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <SortableImage key={image.id} image={image} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {images.length === 0 && (
          <div className="mt-16 text-center text-white/30">
            <Upload className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No photos yet. Add your first one above.</p>
          </div>
        )}

        <p className="mt-12 text-xs text-white/20 text-center">
          {images.length} photo{images.length !== 1 ? "s" : ""} in hero gallery
        </p>
      </main>
    </div>
  )
}
