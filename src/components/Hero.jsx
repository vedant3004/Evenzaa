"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import citiesByState from "../data/cities"
import vendors from "../data/vendors"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Hero() {
  const router = useRouter()

  const [cities, setCities] = useState([])
  const [location, setLocation] = useState("")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const wrapperRef = useRef(null)

  /* ===============================
     GET USER LOCATION
  ================================ */
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          )
          const data = await res.json()
          const stateKey = data?.address?.state?.replace(/\s/g, "") || ""
          setCities(citiesByState[stateKey] || [])
        } catch {
          setCities(citiesByState.Maharashtra || [])
        }
      },
      () => setCities(citiesByState.Maharashtra || [])
    )
  }, [])

  /* ===============================
     SEARCH SUGGESTIONS
  ================================ */
  const suggestions = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.service.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().startsWith(location.toLowerCase())
  )

  /* ===============================
     SEARCH REDIRECT
  ================================ */
  const handleSearch = () => {
    let url = "/vendors"
    const q = []

    if (search) q.push(`q=${encodeURIComponent(search)}`)
    if (location) q.push(`loc=${encodeURIComponent(location)}`)

    if (q.length) url += "?" + q.join("&")
    router.push(url)
  }

  /* ===============================
     OUTSIDE CLICK CLOSE
  ================================ */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <section className="relative pt-24 pb-28 overflow-hidden bg-[var(--bg)]">
      {/* 🔥 Reduced top padding from pt-36 → pt-24 so content moves up */}

      {/* 🌈 FLOATING BLOBS */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-pink-300/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
        className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

        {/* ❌ REMOVED CENTER BIG LOGO COMPLETELY */}

        {/* 📝 HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl xl:text-7xl font-extrabold"
        >
          Plan Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Perfect Event
          </span>
          With Confidence
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-600"
        >
          Discover trusted vendors, compare services, and book unforgettable experiences.
        </motion.p>

        {/* 🔥 SEARCH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`max-w-3xl mx-auto bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl mt-14 transition-all ${
            focus ? "scale-105 ring-4 ring-pink-300" : ""
          }`}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div className="relative">
              <input
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors or events"
                className="input"
              />

              {search && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 bg-white shadow rounded-xl w-full mt-2 max-h-60 overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    suggestions.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => router.push(`/vendors/${v.slug}`)}
                        className="px-4 py-2 cursor-pointer hover:bg-pink-50"
                      >
                        {v.name} —{" "}
                        <span className="text-sm text-gray-500">
                          {v.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No results found
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* LOCATION */}
            <div ref={wrapperRef} className="relative">
              <div
                onClick={() => setOpen(!open)}
                className="input cursor-pointer flex justify-between"
              >
                <span>{location || "Location"}</span>
                <ChevronDown size={18} />
              </div>

              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 bg-white shadow rounded-lg mt-2 w-full max-h-52 overflow-y-auto"
                >
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border-b outline-none"
                    placeholder="Type city"
                  />

                  {filteredCities.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setLocation(c)
                        setOpen(false)
                      }}
                      className="px-3 py-2 hover:bg-pink-50 cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* SEARCH BTN */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
            >
              Search
            </motion.button>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 flex-wrap">
            <span>✔ Verified Vendors</span>
            <span>✔ Best Pricing</span>
            <span>✔ 24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
