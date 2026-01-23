"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, Phone } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function VendorDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, setOpen } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 FETCH FROM REAL DB
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/businesses/${slug}`,
          { cache: "no-store" }
        )

        const data = await res.json()
        if (!res.ok) {
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
          rating: 4.8,
          services: data.services || [],
          phone: data.phone,
          slug: data.slug,
        })
      } catch (err) {
        setVendor(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [slug])

  if (loading) {
    return <div className="pt-32 text-center text-gray-500">Loading vendor...</div>
  }

  if (!vendor) {
    return <div className="pt-32 text-center text-xl">Vendor not found</div>
  }

  const handleBook = () => {
    if (!user) {
      setOpen(true)
      return
    }
    router.push(`/bookings/${vendor.slug}`)
  }

  return (
    <motion.div className="pt-32 pb-20 max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
          <Image src={vendor.image} fill alt={vendor.name} className="object-cover" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold mb-2">{vendor.name}</h1>
          <p className="text-pink-600 font-semibold mb-3">{vendor.service}</p>

          <div className="flex gap-4 text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Star size={18} className="text-yellow-500" /> {vendor.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={18} /> {vendor.location}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{vendor.description}</p>

          <p className="text-2xl font-bold text-pink-600 mb-6">
            Starting from ₹{vendor.price}
          </p>

          <div className="flex gap-4">
            <button onClick={handleBook} className="btn-primary">Book Now</button>

            {vendor.phone && (
              <a
                href={`https://wa.me/${vendor.phone}`}
                target="_blank"
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-green-500 text-green-600"
              >
                <Phone size={18} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {vendor.services.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Services Offered</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {vendor.services.map((s, i) => (
              <li key={i} className="px-4 py-3 rounded-lg bg-pink-50">
                ✔ {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
