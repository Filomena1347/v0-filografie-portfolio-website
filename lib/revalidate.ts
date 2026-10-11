import { revalidatePath } from "next/cache"

export function revalidatePublicMedia() {
  revalidatePath("/", "layout")
  revalidatePath("/api/media")
  revalidatePath("/admin")
}
