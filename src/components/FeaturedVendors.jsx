"use client"

import Image from "next/image"
import Link from "next/link"
import vendors from "../data/vendors"
import { motion } from "framer-motion"

export default function FeaturedVendors() {
  const topVendors = [...vendors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-white text-center"
    >
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-4"
      >
        Featured Vendors
      </motion.h2>

      <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
        Handpicked professionals trusted for weddings, corporate events and celebrations.
      </p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4"
      >
        {topVendors.map((v) => (
          <motion.div
            key={v.id}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={v.image}
                fill
                alt={v.name}
                className="object-cover transition duration-500 group-hover:scale-110"
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
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-14"
      >
        <Link
          href="/vendors"
          className="inline-block px-8 py-3 rounded-xl border border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition"
        >
          View All Vendors
        </Link>
      </motion.div>
    </motion.section>
  )
}
