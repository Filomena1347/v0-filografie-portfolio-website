import { cookies } from "next/headers"
import { createHash } from "crypto"

export const ADMIN_COOKIE = "filo_admin"

/** Deterministic opaque token derived from the admin password. */
export function sessionToken() {
  const secret = (process.env.ADMIN_PASSWORD ?? "").trim()
  return createHash("sha256").update(`filografie:${secret}`).digest("hex")
}

export async function isAuthed() {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === sessionToken()
}
