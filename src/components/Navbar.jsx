"use client"

import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const { user, logout, setOpen, loading, isVendorPage, isAdminPage } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [vendorOpen, setVendorOpen] = useState(false)
  const [adminLogged, setAdminLogged] = useState(false)

  useEffect(() => {
    setAdminLogged(!!localStorage.getItem("evenzaa_admin"))
  }, [user])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 backdrop-blur bg-white/80 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO — 🔥 SIZE INCREASED */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-16 h-16">   {/* was w-12 h-12 */}
            <div className="absolute inset-0 rounded-full bg-pink-400 blur-xl opacity-60 animate-pulse" />
            <Image src="/logo/VY.png" fill alt="EventZaa" className="object-contain" />
          </div>
          <span className="text-2xl font-extrabold text-pink-600 tracking-wide">
            𝓔𝓿𝓮𝓷𝓩𝓪𝓪
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">

          <Link href="/">Home</Link>

          {/* Vendors */}
          <div onMouseEnter={() => setVendorOpen(true)} onMouseLeave={() => setVendorOpen(false)} className="relative">
            <button className="flex items-center gap-1">Vendors <ChevronDown size={16} /></button>
            {vendorOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-xl rounded-xl w-48 overflow-hidden">
                <Link href="/vendor/login" className="block px-4 py-3 hover:bg-pink-50">Vendor Login</Link>
                <Link href="/vendor/register" className="block px-4 py-3 hover:bg-pink-50">Vendor Register</Link>
              </div>
            )}
          </div>

          <Link href="/bookings">Bookings</Link>

          {loading && <span>...</span>}

          {/* ADMIN MODE */}
          {!loading && !user && isAdminPage && !adminLogged && (
            <span className="font-semibold text-pink-600">Admin</span>
          )}

          {/* VENDOR MODE */}
          {!loading && !user && isVendorPage && (
            <span className="font-semibold text-pink-600">Vendor</span>
          )}

          {/* NORMAL MODE */}
          {!loading && !user && !isVendorPage && !isAdminPage && !adminLogged && (
            <button onClick={() => setOpen(true)} className="btn-primary">Login / Signup</button>
          )}

          {/* LOGGED USER / VENDOR / ADMIN */}
          {!loading && (user || adminLogged) && (
            <div className="relative group">
              <span className="cursor-pointer font-semibold text-pink-600">
                {user?.username || user?.name || "Admin"}
              </span>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg right-0 mt-2 p-3">
                <button onClick={logout} className="hover:text-red-500">Logout</button>
              </div>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </motion.nav>
  )
}
