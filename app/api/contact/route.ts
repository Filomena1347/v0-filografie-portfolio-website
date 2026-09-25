import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { name, email, message } = await request.json().catch(() => ({}))

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Submission received. Wire up email delivery (e.g. Resend) here later.
  console.log("[v0] Contact submission:", { name, email })

  return NextResponse.json({ ok: true })
}
