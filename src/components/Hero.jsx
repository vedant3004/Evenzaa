"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import citiesByState from "../data/cities"

import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Hero() {
  const router = useRouter()
const [vendors, setVendors] = useState([])
  const [cities, setCities] = useState([])
  const [location, setLocation] = useState("")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const wrapperRef = useRef(null)

  /* ===============================
     🔥 LIVE INTERACTIVE BACKGROUND
  ================================ */
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const move = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const touchMove = (e) => {
      mouse.current.x = e.touches[0].clientX
      mouse.current.y = e.touches[0].clientY
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("touchmove", touchMove)

    let t = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // base dark
      ctx.fillStyle = "#0B1120"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // flowing blue waves (image-like)
     // ⭐ STAR FIELD
const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.5,
  speed: Math.random() * 0.5 + 0.2
}))

const shootingStars = []

const createShootingStar = () => {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: 0,
    length: Math.random() * 80 + 100,
    speed: Math.random() * 8 + 6,
    opacity: 1
  })
}

setInterval(createShootingStar, 2000)

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // background
  ctx.fillStyle = "#0B1120"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // ⭐ draw normal stars
  stars.forEach((star) => {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()

    star.y += star.speed
    if (star.y > canvas.height) {
      star.y = 0
      star.x = Math.random() * canvas.width
    }
  })

  // 🌠 shooting stars
  shootingStars.forEach((s, i) => {
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(s.x - s.length, s.y + s.length)
    ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`
    ctx.lineWidth = 2
    ctx.stroke()

    s.x -= s.speed
    s.y += s.speed
    s.opacity -= 0.02

    if (s.opacity <= 0) {
      shootingStars.splice(i, 1)
    }
  })

  requestAnimationFrame(animate)
}

animate()


      // glow follows mouse
      const glow = ctx.createRadialGradient(
        mouse.current.x,
        mouse.current.y,
        0,
        mouse.current.x,
        mouse.current.y,
        260
      )

      glow.addColorStop(0, "rgba(56,189,248,0.35)")
      glow.addColorStop(0.5, "rgba(37,99,235,0.18)")
      glow.addColorStop(1, "rgba(11,17,32,0)")

      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      t += 0.01
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", move)
      window.removeEventListener("touchmove", touchMove)
    }
  }, [])

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
  useEffect(() => {
  if (!search || search.length < 2) {
    setVendors([])
    return
  }

  const fetchSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/vendor/search?q=${search}`
      )
      const data = await res.json()
      setVendors(data)
    } catch (err) {
      console.error("Search fetch error:", err)
    }
  }

  const debounce = setTimeout(fetchSearch, 400)
  return () => clearTimeout(debounce)

}, [search])

  /* ===============================
     SEARCH SUGGESTIONS
  ================================ */


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
    <section className="relative pt-24 pb-28 overflow-hidden bg-[#0B1120]">

      {/* 🌌 LIVE CANVAS BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* 🔳 ORIGINAL TEXTURE IMAGE (unchanged) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-texture.png"
          alt="Background texture"
          fill
          priority
          className="object-cover opacity-30 mix-blend-overlay"
        />
      </div>

      {/* 🌑 GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/80 via-[#0B1120]/60 to-[#0B1120] z-0" />

      {/* 🌈 FLOATING BLOBS */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#2563EB]/30 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
        className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-[#3B82F6]/30 rounded-full blur-3xl z-0"
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

        {/* 📝 HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl xl:text-7xl font-extrabold text-white"
        >
          Plan Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
            Perfect Event
          </span>
          With Confidence
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-[#9CA3AF]"
        >
          Discover trusted vendors, compare services, and book unforgettable experiences.
        </motion.p>

        {/* 🔥 SEARCH CARD (100% SAME AS BEFORE) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`max-w-3xl mx-auto bg-[#111827]/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl mt-14 transition-all border border-[#1F2937] ${
            focus ? "scale-105 ring-4 ring-[#2563EB]/40" : ""
          }`}
        >
          {/* 👇 YAHI TUMHARA SEARCH BOX HAI – SAFE */}
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
                  className="absolute z-20 bg-[#111827] shadow rounded-xl w-full mt-2 max-h-60 overflow-y-auto border border-[#1F2937]"
                >
                  {vendors.length > 0 ? (
  vendors.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => router.push(`/vendors/${v.slug}`)}
                        className="px-4 py-2 cursor-pointer hover:bg-[#0F172A] text-white"
                      >
                       {v.business_name} —{" "}
                        <span className="text-sm text-[#9CA3AF]">
                          {v.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-[#9CA3AF]">
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
                  className="absolute z-20 bg-[#111827] shadow rounded-lg mt-2 w-full max-h-52 overflow-y-auto border border-[#1F2937]"
                >
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border-b border-[#1F2937] outline-none bg-transparent text-white"
                    placeholder="Type city"
                  />

                  {filteredCities.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setLocation(c)
                        setOpen(false)
                      }}
                      className="px-3 py-2 hover:bg-[#0F172A] cursor-pointer text-white"
                    >
                      {c}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-lg font-semibold"
            >
              Search
            </motion.button>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm text-[#9CA3AF] flex-wrap">
            <span>✔ Verified Vendors</span>
            <span>✔ Best Pricing</span>
            <span>✔ 24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
