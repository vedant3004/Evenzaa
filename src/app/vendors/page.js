"use client"

import vendors from "../../data/vendors"
import { useAuth } from "../../context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, MapPin } from "lucide-react"

export default function VendorsPage() {
  const { user, setOpen } = useAuth()
  const router = useRouter()
  const params = useSearchParams()

  const cat = params.get("cat")
  const q = params.get("q")
  const loc = params.get("loc")

  const list = vendors.filter((v) => {
    const matchCat = cat ? v.category?.toLowerCase() === cat.toLowerCase() : true
    const matchLoc = loc ? v.location.toLowerCase().includes(loc.toLowerCase()) : true
    const matchQ = q
      ? v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.service.toLowerCase().includes(q.toLowerCase()) ||
        v.category.toLowerCase().includes(q.toLowerCase())
      : true

    return matchCat && matchLoc && matchQ
  })

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-3">
          {cat ? `${cat} Vendors` : "Our Event Service Providers"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore verified vendors. View details, services and pricing before booking.
        </p>
      </div>

      {list.length === 0 && (
        <p className="text-center text-gray-500 font-semibold">
          No vendors found for your search.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((v) => (
          <div key={v.id} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
            <img src={v.image} className="h-48 w-full object-cover rounded-xl mb-4"/>

            <h3 className="font-bold text-xl">{v.name}</h3>
            <p className="text-gray-500">{v.service}</p>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <MapPin size={16} />
              {v.location}
            </div>

            <div className="flex justify-between mt-4 mb-6">
              <span className="text-pink-600 font-bold">₹{v.price}</span>
              <span className="text-yellow-500">⭐ {v.rating}</span>
            </div>

            <button
              onClick={() => router.push(`/vendors/${v.slug}`)}
              className="btn-primary mb-2"
            >
              View Details
            </button>

            <button
              onClick={() => !user ? setOpen(true) : router.push(`/vendors/${v.slug}`)}
              className="btn-primary"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
