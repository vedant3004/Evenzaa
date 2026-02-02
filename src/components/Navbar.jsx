"use client"

import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, logout, setOpen, loading, isVendorPage, isAdminPage } = useAuth()
  const router = useRouter()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [vendorOpen, setVendorOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileVendorOpen, setMobileVendorOpen] = useState(false)
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)
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
          <span className="text-2xl font-extrabold tracking-wide text-blue-400">
            𝓔𝓿𝓮𝓷𝓩𝓪𝓪
          </span>
        </Link>

        {/* ================= DESKTOP MENU (UNCHANGED) ================= */}
        <div className="hidden md:flex items-center gap-8 font-medium text-[#9CA3AF]">

          <Link href="/" className="hover:text-white transition">Home</Link>

          <div ref={vendorRef} className="relative">
            <button
              onClick={() => setVendorOpen(prev => !prev)}
              className="flex items-center gap-1 hover:text-white transition"
            >
              Vendors <ChevronDown size={16} />
            </button>

            {vendorOpen && (
              <div className="absolute top-full mt-2 bg-[#111827] shadow-xl rounded-xl w-48 overflow-hidden border border-[#1F2937]">
                <Link href="/vendor/login"
                  onClick={() => setVendorOpen(false)}
                  className="block px-4 py-3 hover:bg-[#0F172A] text-white">
                  Vendor Login
                </Link>
                <Link href="/vendor/register"
                  onClick={() => setVendorOpen(false)}
                  className="block px-4 py-3 hover:bg-[#0F172A] text-white">
                  Vendor Register
                </Link>
              </div>
            )}
          </div>

          <Link href="/bookings" className="hover:text-white transition">
            Bookings
          </Link>

          {!loading && !user && isAdminPage && (
            <span className="font-semibold text-[#3B82F6]">Admin</span>
          )}

          {!loading && !user && isVendorPage && (
            <span className="font-semibold text-[#3B82F6]">Vendor</span>
          )}

          {!loading && !user && !isVendorPage && !isAdminPage && !adminLogged && (
            <button onClick={() => setOpen(true)} className="btn-primary">
              Login / Signup
            </button>
          )}

          {!loading && (user || adminLogged) && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                className="font-semibold text-[#3B82F6]"
              >
                {user?.name || "Admin"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-[#111827] rounded-lg p-3 min-w-[160px] border border-[#1F2937]">
                  <button
                    onClick={logout}
                    className="w-full text-left text-[#9CA3AF] hover:text-red-400"
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

      {/* ================= MOBILE MENU (DESKTOP-LIKE) ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B1120] border-t border-[#1F2937] px-4 py-6 space-y-4 text-[#9CA3AF]">

          <Link href="/" onClick={() => setMobileOpen(false)} className="block">
            Home
          </Link>

          {/* MOBILE VENDORS DROPDOWN */}
          <button
            onClick={() => setMobileVendorOpen(prev => !prev)}
            className="flex items-center gap-1"
          >
            Vendors <ChevronDown size={16} />
          </button>

          {mobileVendorOpen && (
            <div className="pl-4 space-y-2">
              <Link href="/vendor/login"
                onClick={() => setMobileOpen(false)}
                className="block text-white">
                Vendor Login
              </Link>
              <Link href="/vendor/register"
                onClick={() => setMobileOpen(false)}
                className="block text-white">
                Vendor Register
              </Link>
            </div>
          )}

          <Link href="/bookings" onClick={() => setMobileOpen(false)} className="block">
            Bookings
          </Link>

          {/* MOBILE USER / LOGIN */}
          {!user && !adminLogged && (
            <button
              onClick={() => {
                setMobileOpen(false)
                setOpen(true)
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Login / Signup
            </button>
          )}

          {(user || adminLogged) && (
            <>
              <button
                onClick={() => setMobileProfileOpen(prev => !prev)}
                className="font-semibold text-[#3B82F6]"
              >
                {user?.name || "Admin"}
              </button>

              {mobileProfileOpen && (
                <div className="pl-4">
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                    className="text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.nav>
  )
}
