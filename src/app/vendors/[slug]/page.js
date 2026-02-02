"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, Phone } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function VendorDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, setOpen } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const url = `${API_BASE}/api/vendor/businesses/${slug}`
        console.log("🔗 Fetch vendor detail:", url)

        const res = await fetch(url, { cache: "no-store" })
        const data = await res.json()

        console.log("📥 Vendor API response:", data)

        if (!res.ok || !data) {
          setVendor(null)
          return
        }

        setVendor({
          name: data.business_name,
          service: data.service_type,
          location: data.city,
          description: data.description,
          price: data.price,
          image: data.image || "/placeholder.jpg",
          rating: data.rating || 4.8,
          services: Array.isArray(data.services) ? data.services : [],
          phone: data.phone,
          slug: data.slug,
        })
      } catch (err) {
        console.error("❌ Vendor fetch failed:", err)
        setVendor(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchVendor()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading vendor...
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl text-gray-300">
        Vendor not found
      </div>
    )
  }

  const handleBook = () => {
    if (!user) {
      setOpen(true)
      return
    }
    router.push(`/bookings/${vendor.slug}`)
  }

  return (
    <motion.div className="pt-32 pb-20 max-w-6xl mx-auto px-4 bg-[#0B1120] min-h-screen">
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={vendor.image}
            fill
            alt={vendor.name}
            className="object-cover"
            unoptimized
          />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-white">
            {vendor.name}
          </h1>

          <p className="text-cyan-400 font-semibold mb-3">
            {vendor.service}
          </p>

          <div className="flex gap-6 text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Star size={18} className="text-yellow-400" />
              {vendor.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={18} />
              {vendor.location}
            </span>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {vendor.description}
          </p>

          <p className="text-2xl font-bold text-cyan-400 mb-6">
            Starting from ₹{vendor.price}
          </p>

          <div className="flex gap-4 flex-wrap">
            <button onClick={handleBook} className="btn-primary">
              Book Now
            </button>

            {vendor.phone && (
              <a
                href={`https://wa.me/${vendor.phone}`}
                target="_blank"
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-green-500 text-green-400 hover:bg-green-500/10 transition"
              >
                <Phone size={18} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {vendor.services.length > 0 && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Services Offered
          </h2>

          <ul className="grid sm:grid-cols-2 gap-4">
            {vendor.services.map((s, i) => (
              <li
                key={i}
                className="px-4 py-3 rounded-lg bg-[#0F172A] text-gray-300 border border-[#1F2937]"
              >
                ✔ {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
