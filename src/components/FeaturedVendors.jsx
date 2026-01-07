"use client"

import Image from "next/image"
import Link from "next/link"
import vendors from "../data/vendors"

export default function FeaturedVendors() {

  // ⭐ Only show top 4 highest rated vendors
  const topVendors = [...vendors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  return (
    <section className="py-24 bg-white text-center">
      <h2 className="text-4xl font-extrabold mb-4">
        Featured Vendors
      </h2>

      <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
        Handpicked professionals trusted for weddings, corporate events and celebrations.
      </p>

      {/* TOP 4 VENDORS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {topVendors.map((v) => (
          <div
            key={v.id}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={v.image}
                fill
                alt={v.name}
                className="object-cover group-hover:scale-110 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full">
                {v.service}
              </span>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg mb-1">{v.name}</h3>
              <p className="text-sm text-gray-500 mb-4">⭐ {v.rating} Rating</p>

              <Link
                href={`/vendors/${v.slug}`}
                className="block mt-3 w-full text-center py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW ALL */}
      <div className="mt-14">
        <Link
          href="/vendors"
          className="inline-block px-8 py-3 rounded-xl border border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition"
        >
          View All Vendors
        </Link>
      </div>
    </section>
  )
}
