"use client"

import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"

export default function Navbar() {
  const { user, logout, setOpen, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [vendorOpen, setVendorOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur bg-white/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* ===== LOGO ===== */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-pink-400 blur-xl opacity-60" />
            <Image
              src="/logo/VY.png"
              fill
              alt="EventZaa"
              className="relative z-10 object-contain"
            />
          </div>
          <span className="text-xl font-extrabold text-pink-600 tracking-wide">
            𝓔𝓿𝓮𝓷𝓩𝓪𝓪
          </span>
        </Link>

        {/* ===== DESKTOP MENU ===== */}
        <div className="hidden md:flex items-center gap-8 font-medium">

          <Link href="/" className="hover:text-pink-600">Home</Link>

          {/* ===== VENDORS DROPDOWN ===== */}
          <div
            className="relative"
            onMouseEnter={() => setVendorOpen(true)}
            onMouseLeave={() => setVendorOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-pink-600">
              Vendors <ChevronDown size={16} />
            </button>

            {vendorOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl w-48 overflow-hidden">
                <Link
                  href="/vendor/login"
                  className="block px-4 py-3 hover:bg-pink-50 hover:text-pink-600"
                >
                  Vendor Login
                </Link>
                <Link
                  href="/vendor/register"
                  className="block px-4 py-3 hover:bg-pink-50 hover:text-pink-600"
                >
                  Vendor Register
                </Link>
              </div>
            )}
          </div>

          <Link href="/bookings" className="hover:text-pink-600">
            Bookings
          </Link>

          {/* ===== AUTH ===== */}
          {loading && (
            <span className="px-5 py-2 rounded-lg text-gray-400">...</span>
          )}

          {!loading && !user && (
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
            >
              Login / Signup
            </button>
          )}

          {!loading && user && (
            <div className="relative group">
              <span className="cursor-pointer font-semibold text-pink-600">
                {user?.name || "User"}
              </span>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg right-0 mt-2 p-3 min-w-[120px]">
                <button
                  onClick={logout}
                  className="w-full text-left hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== MOBILE ICON ===== */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-6 space-y-4">

          <Link href="/" className="block hover:text-pink-600">Home</Link>

          {/* MOBILE VENDOR OPTIONS */}
          <div className="border-t pt-3">
            <p className="font-semibold text-gray-500 mb-2">Vendors</p>
            <Link
              href="/vendor/login"
              className="block py-2 hover:text-pink-600"
              onClick={() => setMobileOpen(false)}
            >
              Vendor Login
            </Link>
            <Link
              href="/vendor/register"
              className="block py-2 hover:text-pink-600"
              onClick={() => setMobileOpen(false)}
            >
              Vendor Register
            </Link>
          </div>

          <Link href="/bookings" className="block hover:text-pink-600">
            Bookings
          </Link>

          {loading && <span className="text-gray-400">...</span>}

          {!loading && !user && (
            <button
              onClick={() => {
                setOpen(true)
                setMobileOpen(false)
              }}
              className="w-full mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
            >
              Login / Signup
            </button>
          )}

          {!loading && user && (
            <button
              onClick={logout}
              className="w-full text-left text-red-500 font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
