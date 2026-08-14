"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  password: string | null;
  showLoginModal: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = "filografie_admin_session";
const ADMIN_PASSWORD_KEY = "filografie_admin_password";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    // TEMP_DEBUG_BYPASS - remove after testing
    if (new URLSearchParams(window.location.search).get("debugAdmin") === "1") {
      setIsAdmin(true);
      setPassword("debug-bypass-not-real");
      setIsLoading(false);
      return;
    }
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    const storedPassword = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    if (session === "authenticated" && storedPassword) {
      setIsAdmin(true);
      setPassword(storedPassword);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (inputPassword: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: inputPassword }),
      });

      if (response.ok) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
        sessionStorage.setItem(ADMIN_PASSWORD_KEY, inputPassword);
        setIsAdmin(true);
        setPassword(inputPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setIsAdmin(false);
    setPassword(null);
  }, []);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, password, showLoginModal, login, logout, openLoginModal, closeLoginModal }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
