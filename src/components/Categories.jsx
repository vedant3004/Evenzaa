"use client"

import Link from "next/link"
import { motion } from "framer-motion"

// 🔥 category + image mapping
const categories = [
  { name: "Weddings", image: "/categories/wedding.jpg" },
  { name: "Corporate", image: "/categories/corporate.jpg" },
  { name: "Birthday", image: "/categories/birthday.jpg" },
  { name: "Concerts", image: "/categories/concert.jpg" },
  { name: "Conferences", image: "/categories/conference.jpg" },
  { name: "Sports", image: "/categories/sports.jpg" },
]

// container animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// each card animation
const item = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
}

export default function Categories() {
  return (
    <section className="py-24 bg-white text-center overflow-hidden">

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold mb-14"
      >
        Popular Event Categories
      </motion.h2>

      {/* GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
      >
        {categories.map((c) => (
          <motion.div key={c.name} variants={item}>
            <Link href={`/categories/${c.name}`}>

              <div
                className="relative rounded-2xl shadow-xl cursor-pointer overflow-hidden
                           hover:shadow-[0_25px_80px_-20px_rgba(236,72,153,0.5)]
                           transition-all duration-500 group"
              >
                {/* 🔥 BACKGROUND IMAGE */}
                <div
                  className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-700"
                  style={{ backgroundImage: `url(${c.image})` }}
                />

                {/* 🔥 DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* glowing orb */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />

                {/* content */}
                <div className="relative z-10 p-10 text-left">
                  <h3 className="font-extrabold text-xl mb-2 text-white group-hover:text-pink-400 transition">
                    {c.name}
                  </h3>

                  <p className="text-gray-200 text-sm">
                    1000+ events
                  </p>
                </div>

                {/* shine line */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-700" />
              </div>

            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
