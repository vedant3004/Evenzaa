"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function FeaturedVendors() {
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vendor/businesses`)
        const data = await res.json()

        // ✅ Only approved vendors
        // API already returns approved vendors

const sorted = [...data]
  .sort((a, b) => {
    return Number(b.rating || 0) - Number(a.rating || 0)
  })
  .slice(0, 4)

setVendors(sorted)

      } catch (err) {
        console.error("Featured fetch error:", err)
      }
    }

    fetchFeatured()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-[#0B1120] text-center"
    >
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-4 text-white"
      >
        Featured Vendors
      </motion.h2>

      <p className="text-[#9CA3AF] mb-14 max-w-2xl mx-auto">
        Top rated professionals trusted for events.
      </p>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4"
      >
        {vendors.map((v) => (
          <motion.div
            key={v.id}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
            className="group bg-[#111827] rounded-2xl shadow-lg overflow-hidden border border-[#1F2937]"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={v.image || "/placeholder.jpg"}
                fill
                alt={v.business_name}
                className="object-cover transition duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-xs px-3 py-1 rounded-full">
                {v.category}
              </span>
            </div>

            <div className="p-6 text-left">
              <h3 className="font-bold text-lg mb-1 text-white">
                {v.business_name}
              </h3>

              <p className="text-sm text-[#9CA3AF] mb-4">
                ⭐ {Number(v.rating || 0).toFixed(1)} Rating

              </p>

              <Link
                href={`/vendors/${v.slug}`}
                className="block mt-3 w-full text-center py-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold hover:scale-105 transition"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ View All Vendors Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-14"
      >
        <Link
          href="/vendors"
          className="inline-block px-8 py-3 rounded-xl border border-[#2563EB] text-[#3B82F6] font-semibold hover:bg-[#0F172A] transition"
        >
          View All Vendors
        </Link>
      </motion.div>
    </motion.section>
  )
}
