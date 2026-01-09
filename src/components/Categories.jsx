"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const cats = ["Weddings", "Corporate", "Birthday", "Concerts", "Conferences", "Sports"]

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
        {cats.map((c) => (
          <motion.div key={c} variants={item}>
            <Link href={`/categories/${c}`}>

              <div
                className="relative bg-gradient-to-br from-pink-50 to-purple-50 p-10 rounded-2xl shadow-xl cursor-pointer
                           hover:shadow-[0_25px_80px_-20px_rgba(236,72,153,0.5)]
                           transition-all duration-500 group overflow-hidden"
              >

                {/* glowing orb */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />

                {/* content */}
                <h3 className="relative z-10 font-extrabold text-xl mb-2 text-gray-800 group-hover:text-pink-600 transition">
                  {c}
                </h3>

                <p className="relative z-10 text-gray-500 text-sm">
                  1000+ events
                </p>

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
