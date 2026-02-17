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
  const { user, setOpen, getToken } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
const [avgRating, setAvgRating] = useState(0)
const [totalReviews, setTotalReviews] = useState(0)
const [showModal, setShowModal] = useState(false)
const [rating, setRating] = useState(5)
const [comment, setComment] = useState("")

  const [loading, setLoading] = useState(true)
  const fetchReviews = async (vendorId) => {
  try {
    const res = await fetch(`${API_BASE}/api/reviews/${vendorId}`)
    const data = await res.json()

    setReviews(Array.isArray(data.reviews) ? data.reviews : [])

    setAvgRating(data.avgRating)
    setTotalReviews(data.total)
  } catch (err) {
    console.error("Review fetch error", err)
  }
}


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

       const vendorId = data.id

setVendor({
  id: vendorId,
  name: data.business_name,
  service: data.service_type,
  location: data.city,
  description: data.description,
  price: data.price,
  image: data.image || "/placeholder.jpg",
  services: Array.isArray(data.services) ? data.services : [],
  phone: data.phone,
  slug: data.slug,
})

if (vendorId) {
  fetchReviews(vendorId)
}


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
            {avgRating} ({totalReviews} reviews)

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
            <button
  onClick={() => setShowModal(true)}
  className="px-6 py-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 transition"
>
  View Reviews
</button>

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
      {/* ================= REVIEW MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#111827] w-full max-w-2xl p-8 rounded-2xl overflow-y-auto max-h-[80vh]">

      <h2 className="text-2xl font-bold mb-4 text-white">
        Reviews ({totalReviews})
      </h2>

      {/* Existing Reviews */}
      {/* Existing Reviews */}
{(!reviews || reviews.length === 0) && (
  <p className="text-gray-400 mb-4">No reviews yet.</p>
)}

{reviews &&
  reviews.map((r) => (
    <div key={r.id} className="mb-4 border-b border-gray-700 pb-4">
      <p className="text-yellow-400">⭐ {r.rating}</p>
      <p className="text-white font-semibold">{r.name}</p>
      <p className="text-gray-400">{r.comment}</p>
    </div>
))}


      {/* Add Review Section */}
      {user && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-2">
            Add Review
          </h3>

          {/* Rating Input */}
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                size={24}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full mb-3 p-3 rounded bg-[#0F172A] text-white border border-gray-700"
          />

          <button
           onClick={async () => {
 const token = getToken()


  console.log("Sending token:", token)

  if (!token) {
    alert("Please login again")
    return
  }

  const response = await fetch(`${API_BASE}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      vendorId: vendor.id,
      rating,
      comment,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    alert(result.message)
    return
  }

  setComment("")
  setRating(5)

  await fetchReviews(vendor.id)
}}


            className="btn-primary"
          >
            Submit Review
          </button>
        </div>
      )}

      <button
        onClick={() => setShowModal(false)}
        className="mt-6 text-red-400"
      >
        Close
      </button>

    </div>
  </div>
)}

    </motion.div>
  )
}
