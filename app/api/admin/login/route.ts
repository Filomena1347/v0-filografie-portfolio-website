import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE, sessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const password = typeof body?.password === "string" ? body.password.trim() : ""
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim()

  // Never log the actual secrets, only enough to diagnose mismatches.
  console.log("[v0] admin login attempt:", {
    receivedLength: password.length,
    envSet: expected.length > 0,
    envLength: expected.length,
    match: expected.length > 0 && password === expected,
  })

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const store = await cookies()
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    // "none" so the session cookie also works when the site is embedded (v0 preview iframe).
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({ ok: true })
}
