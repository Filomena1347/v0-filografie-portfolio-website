"use client";

import { useState } from "react";
import { Lock, LogOut, X } from "lucide-react";
import { useAdmin } from "@/contexts/admin-context";

export function AdminLogin() {
  const { isAdmin, isLoading, login, logout, showLoginModal, closeLoginModal, openLoginModal } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const success = await login(password);
    
    if (success) {
      setPassword("");
      closeLoginModal();
    } else {
      setError("Invalid password");
    }
    
    setIsSubmitting(false);
  };

  if (isAdmin) {
    return (
      <button
        onClick={logout}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors duration-200 text-sm font-sans"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <>
      {/* Subtle admin trigger */}
      <button
        onClick={openLoginModal}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors duration-200 opacity-30 hover:opacity-100"
        aria-label="Admin login"
      >
        <Lock className="w-4 h-4 text-white/60" />
      </button>

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeLoginModal}
          />

          {/* Modal */}
          <div className="relative bg-[#12121c] rounded-2xl p-8 w-full max-w-sm border border-white/10 shadow-2xl">
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-white">Admin Access</h2>
              <p className="text-white/50 text-sm mt-2 font-sans">
                Enter your password to manage the gallery
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 font-sans"
                autoFocus
              />

              {error && (
                <p className="text-red-400 text-sm mt-2 font-sans">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="w-full mt-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors duration-200 font-sans"
              >
                {isSubmitting ? "Verifying..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
