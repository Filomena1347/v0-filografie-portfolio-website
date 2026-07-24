"use client"

import { useEffect, useState, useRef } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createClient } from "@/lib/supabase/client"
import type { MediaItem } from "@/lib/types"
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Film,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react"

// ─── Sortable row ─────────────────────────────────────────────────────────────

function SortableRow({
  item,
  onDelete,
  onTogglePublish,
  onUpdateThumbnail,
}: {
  item: MediaItem
  onDelete: (id: string) => void
  onTogglePublish: (id: string, current: boolean) => void
  onUpdateThumbnail: (id: string, url: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [editingThumb, setEditingThumb] = useState(false)
  const [thumbInput, setThumbInput] = useState(item.thumbnail_url ?? "")
  const thumbFileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleThumbFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const path = `thumbnails/${item.id}-${Date.now()}`
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path)
      onUpdateThumbnail(item.id, data.publicUrl)
      setThumbInput(data.publicUrl)
    }
    setEditingThumb(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-3 group transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Thumbnail */}
      <div className="w-14 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 relative">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Film className="w-5 h-5" />
          </div>
        )}
        <button
          onClick={() => setEditingThumb(true)}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          title="Change thumbnail"
        >
          <ImagePlus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Thumbnail editor modal */}
      {editingThumb && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setEditingThumb(false)}
        >
          <div
            className="bg-[#141420] rounded-2xl p-6 w-full max-w-sm mx-4 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-sans text-sm font-medium">Update Thumbnail</h3>
              <button onClick={() => setEditingThumb(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => thumbFileRef.current?.click()}
              className="w-full border border-dashed border-white/20 hover:border-indigo-500 rounded-xl py-3 text-white/40 hover:text-indigo-400 text-sm font-sans transition-colors"
            >
              Upload image file
            </button>
            <input ref={thumbFileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFile} />
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs font-sans">or paste URL</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <input
              type="url"
              value={thumbInput}
              onChange={e => setThumbInput(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => { onUpdateThumbnail(item.id, thumbInput); setEditingThumb(false) }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-sans py-2 rounded-xl transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-sans truncate">{item.title ?? "Untitled"}</p>
        <p className="text-white/30 text-xs font-sans mt-0.5 truncate max-w-xs">{item.src}</p>
      </div>

      {/* Category badge */}
      {item.category && (
        <span className="text-white/30 text-xs font-sans px-2 py-0.5 rounded-full border border-white/10 flex-shrink-0">
          {item.category}
        </span>
      )}

      {/* Publish toggle */}
      <button
        onClick={() => onTogglePublish(item.id, item.published)}
        title={item.published ? "Unpublish" : "Publish"}
        className={`flex-shrink-0 transition-colors ${
          item.published ? "text-emerald-400 hover:text-white/40" : "text-white/20 hover:text-emerald-400"
        }`}
      >
        {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        title="Delete"
        className="flex-shrink-0 text-white/20 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Upload modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [url, setUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setProgress("Uploading to storage…")
    setError(null)

    const path = `videos/${Date.now()}-${file.name}`
    const { error: storageErr } = await supabase.storage.from("media").upload(path, file)
    if (storageErr) { setError(storageErr.message); setUploading(false); return }

    const { data } = supabase.storage.from("media").getPublicUrl(path)
    setUrl(data.publicUrl)
    setProgress("Uploaded. Add details and save.")
    setUploading(false)
  }

  async function handleSave() {
    if (!url) { setError("Please provide a video URL or upload a file."); return }
    setUploading(true)
    setProgress("Saving…")

    const { data: existing } = await supabase
      .from("media_items")
      .select("sort_order")
      .eq("type", "video")
      .order("sort_order", { ascending: false })
      .limit(1)

    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1

    const { error: dbErr } = await supabase.from("media_items").insert({
      type: "video",
      title: title || null,
      src: url,
      category: category || null,
      sort_order: nextOrder,
      published: false,
    })

    if (dbErr) { setError(dbErr.message); setUploading(false); return }
    setUploading(false)
    onUploaded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#141420] rounded-2xl p-6 w-full max-w-md mx-4 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-serif text-xl">Add Video</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-white/20 hover:border-indigo-500 rounded-2xl py-8 flex flex-col items-center gap-2 text-white/40 hover:text-indigo-400 transition-colors disabled:opacity-50"
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm font-sans">{progress ?? "Click to upload video file"}</span>
        </button>
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs font-sans">or paste URL</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://... (video URL)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-indigo-500"
        />

        {error && <p className="text-red-400 text-xs font-sans">{error}</p>}

        <button
          onClick={handleSave}
          disabled={uploading || !url}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-sans text-sm py-3 rounded-xl transition-colors"
        >
          {uploading ? "Saving…" : "Add to gallery"}
        </button>
      </div>
    </div>
  )
}

// ─── Main admin dashboard ─────────────────────────────────────────────────────

export default function AdminDashboard() {
  const supabase = createClient()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from("media_items")
      .select("*")
      .eq("type", "video")
      .order("sort_order", { ascending: true })
    if (!error && data) setItems(data as MediaItem[])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video? This cannot be undone.")) return
    const { error } = await supabase.from("media_items").delete().eq("id", id)
    if (error) { showToast("error", error.message); return }
    setItems(prev => prev.filter(i => i.id !== id))
    showToast("success", "Deleted.")
  }

  async function handleTogglePublish(id: string, current: boolean) {
    const { error } = await supabase
      .from("media_items")
      .update({ published: !current })
      .eq("id", id)
    if (error) { showToast("error", error.message); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, published: !current } : i))
    showToast("success", !current ? "Published." : "Unpublished.")
  }

  async function handleUpdateThumbnail(id: string, url: string) {
    const { error } = await supabase
      .from("media_items")
      .update({ thumbnail_url: url })
      .eq("id", id)
    if (error) { showToast("error", error.message); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, thumbnail_url: url } : i))
    showToast("success", "Thumbnail updated.")
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)

    await Promise.all(
      reordered.map((item, idx) =>
        supabase.from("media_items").update({ sort_order: idx }).eq("id", item.id)
      )
    )
    showToast("success", "Order saved.")
  }

  const publishedCount = items.filter(i => i.published).length

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white">Video Gallery</h1>
          <p className="text-white/40 text-sm font-sans mt-1">
            {items.length} videos &middot; {publishedCount} published
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-sans px-4 py-2.5 rounded-xl transition-colors"
        >
          <Upload className="w-4 h-4" />
          Add video
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-6 text-xs font-sans text-white/30">
        <span className="flex items-center gap-1.5"><GripVertical className="w-3.5 h-3.5" /> Drag to reorder</span>
        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-emerald-400" /> Published</span>
        <span className="flex items-center gap-1.5"><EyeOff className="w-3.5 h-3.5" /> Unpublished</span>
        <span className="flex items-center gap-1.5"><ImagePlus className="w-3.5 h-3.5" /> Hover card to edit thumbnail</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[88px] bg-white/[0.04] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
          <Film className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 font-sans text-sm">No videos yet.</p>
          <p className="text-white/20 font-sans text-xs mt-1">Click &ldquo;Add video&rdquo; to get started.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map(item => (
                <SortableRow
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  onUpdateThumbnail={handleUpdateThumbnail}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={fetchItems} />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl font-sans text-sm transition-all ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}
    </main>
  )
}
