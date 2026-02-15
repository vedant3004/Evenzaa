"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function CategoryPage() {
  const { cat } = useParams()
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/vendor/businesses?category=${cat}`
        )
        const data = await res.json()
        setVendors(data)
      } catch (err) {
        console.error("Vendor fetch error:", err)
      }
    }

    if (cat) fetchVendors()
  }, [cat])

  return (
    <div className="pt-28 max-w-7xl mx-auto px-4 bg-[#0B1120] min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-white">
        {cat} Vendors
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {vendors.length === 0 && (
          <p className="text-gray-400">
            No vendors found in this category.
          </p>
        )}

        {vendors.map(v => (
          <div
            key={v.id}
            className="bg-[#111827] p-6 rounded-xl shadow border border-[#1F2937]"
          >
            <img
              src={v.image}
              className="h-48 w-full object-cover rounded mb-4"
            />

            <h3 className="font-bold text-white">
              {v.business_name}
            </h3>

            <p className="text-[#9CA3AF] mt-1">
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
