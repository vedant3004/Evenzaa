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

// 🎨 CATEGORY COLOR THEMES (NEW – ADDED)
const categoryColors = {
  Weddings: {
    primary: "#FB7185",
    secondary: "#F43F5E",
    glow: "rgba(251,113,133,0.45)",
  },
  Corporate: {
    primary: "#2563EB",
    secondary: "#3B82F6",
    glow: "rgba(37,99,235,0.55)",
  },
  Birthday: {
    primary: "#A855F7",
    secondary: "#D946EF",
    glow: "rgba(168,85,247,0.55)",
  },
  Concerts: {
    primary: "#22D3EE",
    secondary: "#06B6D4",
    glow: "rgba(34,211,238,0.6)",
  },
  Conferences: {
    primary: "#6366F1",
    secondary: "#818CF8",
    glow: "rgba(99,102,241,0.55)",
  },
  Sports: {
    primary: "#22C55E",
    secondary: "#4ADE80",
    glow: "rgba(34,197,94,0.55)",
  },
}

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
    <section className="py-24 bg-[#0B1120] text-center overflow-hidden">

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold mb-14 text-white"
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
        {categories.map((c) => {
          const colors = categoryColors[c.name]

          return (
            <motion.div key={c.name} variants={item}>
              <Link href={`/categories/${c.name}`}>

                <div
                  className="relative rounded-2xl shadow-xl cursor-pointer overflow-hidden
                             transition-all duration-500 group"
                  style={{
                    boxShadow: `0 25px 80px -20px ${colors.glow}`,
                  }}
                >
                  {/* 🔥 BACKGROUND IMAGE */}
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-700"
                    style={{ backgroundImage: `url(${c.image})` }}
                  />

                  {/* 🔥 DARK GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/40 to-transparent" />

                  {/* 🌈 CATEGORY COLORED GLOW ORB */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500"
                    style={{ backgroundColor: colors.primary }}
                  />

                  {/* CONTENT */}
                  <div className="relative z-10 p-10 text-left">
                    <h3
                      className="font-extrabold text-xl mb-2 transition"
                      style={{ color: "white" }}
                    >
                      <span
                        className="group-hover:text-transparent bg-clip-text bg-gradient-to-r transition"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                        }}
                      >
                        {c.name}
                      </span>
                    </h3>

                    <p className="text-[#E5E7EB] text-sm">
                      1000+ events
                    </p>
                  </div>

                  {/* ✨ CATEGORY COLORED SHINE LINE */}
                  <div
                    className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    }}
                  />
                </div>

              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
