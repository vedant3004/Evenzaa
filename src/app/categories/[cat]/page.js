"use client"
import vendors from "../../../data/vendors"
import { useParams, useRouter } from "next/navigation"

export default function CategoryPage() {
  const { cat } = useParams()
  const router = useRouter()

  const list = vendors.filter(
    v => v.category.toLowerCase() === cat.toLowerCase()
  )

  return (
    <div className="pt-28 max-w-7xl mx-auto px-4 bg-[#0B1120] min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-white">
        {cat} Vendors
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {list.map(v => (
          <div
            key={v.id}
            className="bg-[#111827] p-6 rounded-xl shadow border border-[#1F2937]"
          >
            <img
              src={v.image}
              className="h-48 w-full object-cover rounded mb-4"
            />

            <h3 className="font-bold text-white">
              {v.name}
            </h3>

            <p className="text-[#9CA3AF] mt-1">
              {v.desc}
            </p>

            <button
              onClick={() => router.push(`/vendors/${v.slug}`)}
              className="btn-primary w-full mt-4"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
