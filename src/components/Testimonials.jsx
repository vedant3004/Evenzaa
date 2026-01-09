"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Bride",
    review:
      "EventZaa made my wedding planning completely stress-free. The vendors were amazing!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Corporate Client",
    review:
      "Excellent service and professional vendors. Our corporate event was a big success.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "Event Host",
    review:
      "Very smooth booking experience and great customer support throughout.",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white text-center overflow-hidden">

      {/* HEADING */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold mb-4"
      >
        What Our Clients Say
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-gray-600 mb-16 max-w-2xl mx-auto"
      >
        Hear from people who trusted EventZaa for their special occasions.
      </motion.p>

      {/* TESTIMONIAL CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: i * 0.2,
              duration: 0.9,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left overflow-hidden"
          >

            {/* Soft glow layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-300/20 opacity-0 hover:opacity-100 transition duration-500" />

            {/* Stars */}
            <div className="relative z-10 flex gap-1 text-yellow-500 mb-4">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={18} fill="currentColor" />
              ))}
            </div>

            {/* Review */}
            <p className="relative z-10 text-gray-600 italic mb-6 leading-relaxed">
              “{t.review}”
            </p>

            {/* User */}
            <div className="relative z-10">
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  )
}
