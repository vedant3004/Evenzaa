"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function CategoryPage() {
  const params = useParams()

  // 🔥 category decode + formatting
  const cat = params?.cat
  ? decodeURIComponent(params.cat)
  : ""


  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)

        console.log("Fetching category:", cat)

        // ✅ CORRECT API (FILTERED)
        const res = await fetch(
          `${API_BASE}/api/vendor/category/${cat}`,
          { cache: "no-store" }
        )

        if (!res.ok) {
          console.error("API ERROR:", res.status)
          setVendors([])
          return
        }

        const data = await res.json()

        if (!Array.isArray(data)) {
          console.error("Invalid response:", data)
          setVendors([])
          return
        }

        setVendors(data)

      } catch (err) {
        console.error("Vendor fetch error:", err)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    if (cat) fetchVendors()
  }, [cat])

  return (
    <div className="pt-28 max-w-7xl mx-auto px-4 bg-[#0B1120] min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-white">
        {cat} Vendors
      </h1>

      {/* 🔄 Loading */}
      {loading && (
        <p className="text-gray-400">
          Loading vendors...
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {!loading && vendors.length === 0 && (
          <p className="text-gray-400">
            No vendors found in this category.
          </p>
        )}

        {vendors.map(v => (
          <div
            key={v.id}
            className="bg-[#111827] p-6 rounded-xl shadow border border-[#1F2937] hover:border-blue-500 transition"
          >
            <img
              src={v.image || "/placeholder.jpg"}
              className="h-48 w-full object-cover rounded mb-4"
              alt={v.business_name}
            />

            <h3 className="font-bold text-white">
              {v.business_name}
            </h3>

            <p className="text-[#9CA3AF] mt-1 line-clamp-2">
              {v.description}
            </p>

            <Link
              href={`/vendors/${v.slug}`}
              className="btn-primary w-full mt-4 block text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
