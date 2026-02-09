"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext()

/* ================= API BASE ================= */
const AUTH_API = "http://localhost:5000/api/auth"
const VENDOR_API = "http://localhost:5000/api/vendor"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  /* ================= LOAD SESSION ================= */
  useEffect(() => {
    const u = localStorage.getItem("eventzaa_user")
    const v = localStorage.getItem("evenzaa_vendor")
    const a = localStorage.getItem("evenzaa_admin")

    if (a && a.split(".").length === 3) {
      setUser({
        role: "admin",
        username: "Admin",
        displayName: "Admin",
      })
    } else if (v) {
      const vendor = JSON.parse(v)
      setUser({
        ...vendor,
        role: "vendor",
        displayName: vendor.name || vendor.business || "Vendor",
      })
    } else if (u) {
      const usr = JSON.parse(u)
      setUser({
        ...usr,
        role: "user",
        displayName: usr.name || "User",
      })
    }

    setLoading(false)
  }, [])

  /* ================= AUTO REDIRECT AFTER LOGIN ================= */
  useEffect(() => {
    if (!user) return
    const redirect = localStorage.getItem("redirectAfterLogin")
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirect)
    }
  }, [user, router])

  /* ================= AUTO REDIRECT ON WEBSITE REOPEN ================= */
  useEffect(() => {
    if (loading || !user) return

    if (user.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard")
    }

    if (user.role === "vendor" && !pathname.startsWith("/vendor")) {
      router.replace("/vendor/dashboard")
    }
  }, [user, pathname, router, loading])

  const isVendorPage = pathname.startsWith("/vendor")
  const isAdminPage = pathname.startsWith("/admin")

  /* ================= TOKEN HELPER (🆕 ADD) ================= */
  const getToken = () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("evenzaa_token")
  }

  /* ================= USER LOGIN ================= */
  const login = async (data) => {
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const u = {
        ...json.user,
        role: "user",
        displayName: json.user.name,
      }

      localStorage.setItem("eventzaa_user", JSON.stringify(u))
      localStorage.setItem("evenzaa_token", json.token)

      localStorage.removeItem("evenzaa_vendor")
      localStorage.removeItem("evenzaa_admin")

      setUser(u)
      setOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= USER REGISTER ================= */
  const register = async (data) => {
    try {
      const res = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      await login(data)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= VENDOR LOGIN ================= */
  const loginVendor = async (data) => {
    try {
      const res = await fetch(`${VENDOR_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const v = {
        ...json.vendor,
        role: "vendor",
        displayName: json.vendor.name || "Vendor",
      }

      localStorage.setItem("evenzaa_vendor", JSON.stringify(v))
      localStorage.setItem("evenzaa_token", json.token)

      localStorage.removeItem("eventzaa_user")
      localStorage.removeItem("evenzaa_admin")

      setUser(v)
      setOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= ADMIN LOGIN ================= */
  const loginAdmin = ({ token }) => {
    if (!token || token.split(".").length !== 3) return

    localStorage.setItem("evenzaa_admin", token)
    localStorage.setItem("evenzaa_token", token)

    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("evenzaa_vendor")

    setUser({ role: "admin", displayName: "Admin" })
    setOpen(false)
  }

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("evenzaa_vendor")
    localStorage.removeItem("evenzaa_admin")
    localStorage.removeItem("evenzaa_token")

    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        open,
        setOpen,
        isVendorPage,
        isAdminPage,

        getToken, // ✅ IMPORTANT

        login,
        register,
        loginVendor,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
