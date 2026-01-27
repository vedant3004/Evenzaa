"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function VendorsPage() {
  const { user, setOpen } = useAuth()
  const router = useRouter()
  const params = useSearchParams()

  const cat = params.get("cat")
  const q = params.get("q")
  const loc = params.get("loc")

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        console.log("🔗 Fetching from:", `${API_BASE}/api/vendor/businesses`)

        const res = await fetch(
          `${API_BASE}/api/vendor/businesses`,
          { cache: "no-store" }
        )

        if (!res.ok) {
          console.error("❌ API status:", res.status)
          setVendors([])
          return
        }

        const data = await res.json()

        if (!Array.isArray(data)) {
          console.error("❌ Invalid API response:", data)
          setVendors([])
          return
        }

        const normalized = data.map((v) => ({
          id: v.id,
          name: v.business_name || "Unnamed Vendor",
          slug: v.slug,
          service: v.service_type || "",
          location: v.city || "",
          price: v.price || 0,
          image: v.image || "/placeholder.jpg",
          rating: v.rating || 4.8,
          category: v.service_type || "",
        }))

        setVendors(normalized)
      } catch (err) {
        console.error("🔥 FETCH FAILED:", err)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const list = vendors.filter((v) => {
    const matchCat = cat
      ? v.category?.toLowerCase() === cat.toLowerCase()
      : true
    const matchLoc = loc
      ? v.location?.toLowerCase().includes(loc.toLowerCase())
      : true
    const matchQ = q
      ? v.name?.toLowerCase().includes(q.toLowerCase()) ||
        v.service?.toLowerCase().includes(q.toLowerCase())
      : true
    return matchCat && matchLoc && matchQ
  })

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading vendors...
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className="pt-32 text-center text-gray-400">
        No vendors found
      </div>
    )
  }

  return (
    <motion.div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((v) => (
          <div
            key={v.id}
            className="bg-[#111827] p-6 rounded-xl"
          >
            <img
              src={v.image}
              alt={v.name}
              className="h-40 w-full object-cover rounded-lg mb-4"
            />

            <h3 className="text-white font-bold">{v.name}</h3>
            <p className="text-gray-400">{v.service}</p>

            <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
              <MapPin size={14} /> {v.location}
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-pink-500 font-bold">
                ₹{v.price}
              </span>
              <span className="text-yellow-400 flex items-center gap-1">
                <Star size={14} fill="currentColor" />
                {v.rating}
              </span>
            </div>

            <button
              onClick={() => router.push(`/vendors/${v.slug}`)}
              className="btn-primary w-full mt-4"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
