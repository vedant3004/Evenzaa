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

    if (a) {
      setUser({
        role: "admin",
        username: "Admin",
        displayName: "Admin",
      })
    }
    else if (v) {
      const vendor = JSON.parse(v)
      setUser({
        ...vendor,
        role: "vendor",
        displayName: vendor.name || vendor.business || "Vendor",
      })
    }
    else if (u) {
      const usr = JSON.parse(u)
      setUser({
        ...usr,
        role: "user",
        displayName: usr.name || "User",
      })
    }

    setLoading(false)
  }, [])

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    if (!user) return
    const redirect = localStorage.getItem("redirectAfterLogin")
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirect)
    }
  }, [user, router])

  const isVendorPage = pathname.startsWith("/vendor")
  const isAdminPage = pathname.startsWith("/admin")

  /* ================= USER LOGIN (BACKEND) ================= */
  const login = async (data) => {
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const u = {
        ...json.user,
        role: "user",
        displayName: json.user.name,
      }

      localStorage.setItem("eventzaa_user", JSON.stringify(u))
      localStorage.setItem("eventzaa_token", json.token)

      localStorage.removeItem("evenzaa_vendor")
      localStorage.removeItem("evenzaa_admin")

      setUser(u)
      setOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= USER REGISTER (BACKEND) ================= */
  const register = async (data) => {
    try {
      const res = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      // auto login after register
      await login(data)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= VENDOR LOGIN (BACKEND) ================= */
  const loginVendor = async (data) => {
    try {
      const res = await fetch(`${VENDOR_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const v = {
        ...json.vendor,
        role: "vendor",
        displayName: json.vendor.name || json.vendor.business || "Vendor",
      }

      localStorage.setItem("evenzaa_vendor", JSON.stringify(v))
      localStorage.setItem("eventzaa_vendor_token", json.token)

      localStorage.removeItem("eventzaa_user")
      localStorage.removeItem("evenzaa_admin")

      setUser(v)
      setOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= ADMIN LOGIN ================= */
  const loginAdmin = () => {
    localStorage.setItem("evenzaa_admin", "true")
    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("evenzaa_vendor")

    setUser({
      role: "admin",
      username: "Admin",
      displayName: "Admin",
    })

    setOpen(false)
  }

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("evenzaa_vendor")
    localStorage.removeItem("evenzaa_admin")
    localStorage.removeItem("eventzaa_token")
    localStorage.removeItem("eventzaa_vendor_token")

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

        /* user */
        login,
        register,

        /* vendor */
        loginVendor,

        /* admin */
        loginAdmin,

        /* common */
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
