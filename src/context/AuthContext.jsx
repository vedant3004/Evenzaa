"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { findUser } from "../utils/userDB"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // =====================================
  // LOAD USER / VENDOR ON PAGE REFRESH
  // =====================================
  useEffect(() => {
    const savedUser = localStorage.getItem("eventzaa_user")
    const savedVendor = localStorage.getItem("eventzaa_vendor")

    if (savedVendor) {
      setUser(JSON.parse(savedVendor))
    } else if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  // =====================================
  // 🔥 AUTO REDIRECT AFTER LOGIN (MAIN FIX)
  // =====================================
  useEffect(() => {
    if (!user) return

    const redirect = localStorage.getItem("redirectAfterLogin")
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirect)
    }
  }, [user, router])

  // =====================================
  // 🔐 REQUIRE LOGIN (BOOK NOW GUARD)
  // =====================================
  const requireLogin = (redirectTo) => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", redirectTo)
      setOpen(true)
      return false
    }
    return true
  }

  // =====================================
  // CUSTOMER LOGIN
  // =====================================
  const login = (data) => {
    const found = findUser(data.email, data.password)

    if (!found) {
      alert("Invalid Email or Password")
      return
    }

    const userData = {
      ...found,
      role: "user",
    }

    localStorage.setItem("eventzaa_user", JSON.stringify(userData))
    localStorage.removeItem("eventzaa_vendor")

    setUser(userData)
    setOpen(false)
  }

  // =====================================
  // VENDOR LOGIN
  // =====================================
  const loginVendor = (data) => {
    const vendors = JSON.parse(localStorage.getItem("vendors") || "[]")

    const found = vendors.find(
      (v) => v.email === data.email && v.password === data.password
    )

    if (!found) {
      alert("Invalid Vendor Credentials")
      return
    }

    const vendorData = {
      ...found,
      role: "vendor",
    }

    localStorage.setItem("eventzaa_vendor", JSON.stringify(vendorData))
    localStorage.removeItem("eventzaa_user")

    setUser(vendorData)
    setOpen(false)
  }

  // =====================================
  // LOGOUT (USER / VENDOR)
  // =====================================
  const logout = () => {
    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("eventzaa_vendor")
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

        // 🔥 IMPORTANT
        requireLogin,

        // auth
        login,
        loginVendor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
