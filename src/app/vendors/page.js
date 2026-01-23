"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function VendorsPage() {
  const { user, setOpen } = useAuth()
  const router = useRouter()
  const params = useSearchParams()

  const cat = params.get("cat")
  const q = params.get("q")
  const loc = params.get("loc")

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 FETCH FROM REAL DB
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/businesses`,
          { cache: "no-store" }
        )

       let data
const text = await res.text()

try {
  data = JSON.parse(text)
} catch (e) {
  console.error("❌ Not JSON response:", text)
  setVendors([])
  setLoading(false)
  return
}


        console.log("📦 Vendors API response:", data)

        if (!res.ok || !Array.isArray(data)) {
          console.warn("⚠️ Invalid vendors response")
          setVendors([])
          return
        }

        // normalize backend → frontend
        const normalized = data.map(v => ({
          id: v.id,
          name: v.business_name,
          slug: v.slug,
          service: v.service_type,
          location: v.city,
          price: v.price,
          image: v.image || "/placeholder.jpg",
          rating: v.rating || 4.8,
          category: v.service_type,
        }))

        setVendors(normalized)
      } catch (err) {
        console.error("❌ Vendors fetch error:", err)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // FILTER
  const list = vendors.filter((v) => {
    const matchCat = cat ? v.category?.toLowerCase() === cat.toLowerCase() : true
    const matchLoc = loc ? v.location?.toLowerCase().includes(loc.toLowerCase()) : true
    const matchQ = q
      ? v.name?.toLowerCase().includes(q.toLowerCase()) ||
        v.service?.toLowerCase().includes(q.toLowerCase())
      : true
    return matchCat && matchLoc && matchQ
  })

  const handleBookNow = (vendor) => {
    localStorage.setItem("redirectAfterLogin", `/bookings/${vendor.slug}`)
    if (!user) {
      setOpen(true)
      return
    }
    router.push(`/bookings/${vendor.slug}`)
  }

  if (loading) {
    return <div className="pt-32 text-center text-gray-500">Loading vendors...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 max-w-7xl mx-auto px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-3">
          Our Event Service Providers
        </h1>
        <p className="text-gray-600">
          Explore verified vendors and book with confidence.
        </p>
      </div>

      {list.length === 0 && (
        <p className="text-center text-gray-500 font-semibold">
          No vendors available right now.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((v) => (
          <div
            key={v.id}
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col"
          >
            <img
              src={v.image}
              alt={v.name}
              className="h-48 w-full object-cover rounded-xl mb-4"
            />

            <h3 className="font-bold text-xl">{v.name}</h3>
            <p className="text-gray-500">{v.service}</p>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <MapPin size={16} />
              {v.location}
            </div>

            <div className="flex justify-between mt-4 mb-6">
              <span className="text-pink-600 font-bold">₹{v.price}</span>
              <span className="text-yellow-500 flex items-center gap-1">
                <Star size={16} fill="currentColor" />
                {v.rating}
              </span>
            </div>

            <button
              onClick={() => router.push(`/vendors/${v.slug}`)}
              className="btn-primary mb-2"
            >
              View Details
            </button>

            <button
              onClick={() => handleBookNow(v)}
              className="btn-primary"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
