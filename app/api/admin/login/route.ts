import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE, sessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }))

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const store = await cookies()
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({ ok: true })
}
