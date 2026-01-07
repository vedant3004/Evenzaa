"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { findUser } from "../utils/userDB"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 🔁 Load saved user/vendor
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

  // =======================
  // CUSTOMER LOGIN
  // =======================
  const loginUser = (data) => {
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

  // 🔁 COMMON LOGIN (for AuthPopup)
  const login = (data) => {
    loginUser(data)
  }

  // =======================
  // VENDOR LOGIN
  // =======================
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
  }

  // =======================
  // VENDOR REGISTER
  // =======================
  const registerVendor = (data) => {
    const vendors = JSON.parse(localStorage.getItem("vendors") || "[]")

    const exists = vendors.find((v) => v.email === data.email)
    if (exists) {
      alert("Vendor already registered with this email")
      return
    }

    const newVendor = {
      id: Date.now(),
      ...data,
      role: "vendor",
      createdAt: new Date().toLocaleString(),
    }

    localStorage.setItem("vendors", JSON.stringify([...vendors, newVendor]))
    localStorage.setItem("eventzaa_vendor", JSON.stringify(newVendor))

    setUser(newVendor)
  }

  // =======================
  // LOGOUT
  // =======================
  const logout = () => {
    localStorage.removeItem("eventzaa_user")
    localStorage.removeItem("eventzaa_vendor")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        open,
        setOpen,

        // customer
        loginUser,

        // vendor
        loginVendor,
        registerVendor,

        // common popup
        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
