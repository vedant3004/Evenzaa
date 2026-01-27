"use client"

import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const { user, logout, setOpen, loading, isVendorPage, isAdminPage } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [vendorOpen, setVendorOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [adminLogged, setAdminLogged] = useState(false)

  const vendorRef = useRef(null)
  const profileRef = useRef(null)

  /* ===============================
     ADMIN SESSION DETECT
  =============================== */
  useEffect(() => {
    setAdminLogged(!!localStorage.getItem("evenzaa_admin"))
  }, [user])

  /* ===============================
     CLOSE DROPDOWNS ON OUTSIDE CLICK
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target)) {
        setVendorOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur bg-[#0B1120]/80 shadow-lg border-b border-[#1F2937]"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-[#2563EB] blur-xl opacity-50 animate-pulse" />
            <Image
              src="/logo/VY.png"
              fill
              alt="EventZaa"
              className="relative z-10 object-contain"
            />
          </div>
          <span className="text-2xl font-extrabold tracking-wide text-white">
            𝓔𝓿𝓮𝓷𝓩𝓪𝓪
          </span>
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-8 font-medium text-[#9CA3AF]">

          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          {/* ================= VENDORS DROPDOWN ================= */}
          <div ref={vendorRef} className="relative">
            <button
              onClick={() => setVendorOpen(prev => !prev)}
              className="flex items-center gap-1 hover:text-white transition"
            >
              Vendors <ChevronDown size={16} />
            </button>

            {vendorOpen && (
              <div className="absolute top-full mt-2 bg-[#111827] shadow-xl rounded-xl w-48 overflow-hidden border border-[#1F2937]">
                <Link
                  href="/vendor/login"
                  onClick={() => setVendorOpen(false)}
                  className="block px-4 py-3 hover:bg-[#0F172A] text-white"
                >
                  Vendor Login
                </Link>
                <Link
                  href="/vendor/register"
                  onClick={() => setVendorOpen(false)}
                  className="block px-4 py-3 hover:bg-[#0F172A] text-white"
                >
                  Vendor Register
                </Link>
              </div>
            )}
          </div>

          <Link href="/bookings" className="hover:text-white transition">
            Bookings
          </Link>

          {loading && <span className="text-[#6B7280]">...</span>}

          {/* ================= ADMIN / VENDOR LABEL ================= */}
          {!loading && !user && isAdminPage && !adminLogged && (
            <span className="font-semibold text-[#3B82F6]">Admin</span>
          )}

          {!loading && !user && isVendorPage && (
            <span className="font-semibold text-[#3B82F6]">Vendor</span>
          )}

          {/* ================= LOGIN BUTTON ================= */}
          {!loading && !user && !isVendorPage && !isAdminPage && !adminLogged && (
            <button
              onClick={() => setOpen(true)}
              className="btn-primary"
            >
              Login / Signup
            </button>
          )}

          {/* ================= USER / ADMIN DROPDOWN ================= */}
          {!loading && (user || adminLogged) && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                className="font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition"
              >
                {user?.displayName || user?.username || user?.name || "Admin"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-[#111827] shadow-lg rounded-lg p-3 min-w-[140px] border border-[#1F2937]">
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      logout()
                    }}
                    className="w-full text-left text-[#9CA3AF] hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= MOBILE ICON ================= */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </motion.nav>
  )
}
