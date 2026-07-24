import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in and not already on the login page, redirect
  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Admin top bar */}
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-serif text-lg text-white">Filoména</a>
          <span className="text-white/20 text-sm font-sans">/ Admin</span>
        </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs font-sans">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-white/40 hover:text-white text-xs font-sans transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
      </header>
      {children}
    </div>
  )
}
