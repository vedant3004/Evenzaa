"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import vendors from "../../../data/vendors"
import { Star, MapPin, Phone } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"

export default function VendorDetailPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug)
  const router = useRouter()
  const { user, setOpen } = useAuth()

  const vendor = vendors.find(v => v.slug === slug)

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        Vendor not found
      </div>
    )
  }

  const handleBook = () => {
    if (!user) {
      setOpen(true)              // 🔒 force login
      return
    }
    router.push(`/bookings/${vendor.slug}`)
  }

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-4">

      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">

        {/* IMAGE */}
        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={vendor.image}
            fill
            alt={vendor.name}
            className="object-cover"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-4xl font-extrabold mb-2">{vendor.name}</h1>

          <p className="text-pink-600 font-semibold mb-3">{vendor.service}</p>

          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Star size={18} className="text-yellow-500" />
              {vendor.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={18} />
              {vendor.location}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{vendor.description}</p>

          <p className="text-2xl font-bold text-pink-600 mb-6">
            Starting from ₹{vendor.price}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 flex-wrap">
            {/* 🔐 LOGIN-GATED BOOK NOW */}
            <button onClick={handleBook} className="btn-primary">
              Book Now
            </button>

            <a
              href={`https://wa.me/${vendor.whatsapp}`}
              target="_blank"
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-green-500 text-green-600 hover:bg-green-50 transition"
            >
              <Phone size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Services Offered</h2>

        <ul className="grid sm:grid-cols-2 gap-4">
          {vendor.services.map((s) => (
            <li key={s} className="px-4 py-3 rounded-lg bg-pink-50 font-medium">
              ✔ {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
