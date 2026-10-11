"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Upload, Loader2 } from "lucide-react";
import { useAdmin } from "@/contexts/admin-context";
import type { GalleryImage } from "@/lib/cloudinary";

interface SortableGalleryProps {
  images: GalleryImage[];
  category: string;
  onImagesChange: (images: GalleryImage[]) => void;
  isModalOpen: boolean;
}

interface SortableImageProps {
  image: GalleryImage;
  isAdmin: boolean;
  onDelete: (publicId: string) => void;
  isDeleting: boolean;
}

function SortableImage({ image, isAdmin, onDelete, isDeleting }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: !isAdmin });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="break-inside-avoid mb-0 group relative bg-[#0a0a0f]"
    >
      <div className="w-full overflow-hidden transition-all duration-300 hover:brightness-110 bg-[#0a0a0f]">
        <img
          src={image.url}
          alt=""
          className="w-full h-auto object-contain bg-[#0a0a0f]"
          loading="lazy"
        />
      </div>

      {/* Admin controls overlay */}
      {isAdmin && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-white" />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(image.publicId)}
            disabled={isDeleting}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <X className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function ImageOverlay({ image }: { image: GalleryImage }) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-2xl"
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
        width: 200,
      }}
    >
      <img
        src={image.url}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function SortableGallery({
  images,
  category,
  onImagesChange,
  isModalOpen,
}: SortableGalleryProps) {
  const { isAdmin, password } = useAdmin();
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const image = images.find((img) => img.id === active.id);
    setActiveImage(image || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveImage(null);

    if (!over || active.id === over.id || !password) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex);
    
    // Update order values
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index + 1,
    }));

    onImagesChange(reorderedImages);

    // Save to backend
    setIsSaving(true);
    try {
      await fetch("/api/gallery/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          images: reorderedImages.map((img) => ({
            publicId: img.publicId,
            order: img.order,
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this image?") || !password) return;

    setDeletingId(publicId);
    try {
      const response = await fetch("/api/gallery/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        onImagesChange(images.filter((img) => img.publicId !== publicId));
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !password) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      try {
        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          headers: {
            "x-admin-password": password,
          },
          body: formData,
        });

        if (response.ok) {
          const { image } = await response.json();
          onImagesChange([...images, image]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setIsUploading(false);
    e.target.value = "";
  }, [category, images, onImagesChange, password]);

  return (
    <div className="px-0 pb-12">
      {/* Admin upload button */}
      {isAdmin && (
        <div className="flex justify-center mb-6 px-6">
          <label className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium cursor-pointer transition-colors duration-200 font-sans">
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Images</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          {isSaving && (
            <div className="ml-4 flex items-center gap-2 text-white/60 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving order...</span>
            </div>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
          disabled={!isAdmin}
        >
          <div className="columns-2 md:columns-4 gap-0 bg-[#0a0a0f]">
            {images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  animation: isModalOpen
                    ? `fadeInUp 0.5s ease-out ${index * 50}ms both`
                    : "none",
                }}
              >
                <SortableImage
                  image={image}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  isDeleting={deletingId === image.publicId}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeImage && <ImageOverlay image={activeImage} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
