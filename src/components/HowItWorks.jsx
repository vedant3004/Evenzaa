"use client"

import { Search, Users, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: Search,
    title: "Choose Your Event",
    desc: "Select the type of event you want to organize.",
  },
  {
    icon: Users,
    title: "Browse Vendors",
    desc: "Compare verified vendors and services easily.",
  },
  {
    icon: CalendarCheck,
    title: "Book & Celebrate",
    desc: "Confirm bookings and enjoy a stress-free event.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-[#0B1120] py-24 text-center overflow-hidden">

      {/* HEADING */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold mb-4 text-white"
      >
        How It Works
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-[#9CA3AF] mb-14 max-w-2xl mx-auto"
      >
        Organizing your event is simple, fast and hassle-free with EventZaa.
      </motion.p>

      {/* STEPS */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
        {steps.map((step, i) => {
          const Icon = step.icon

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.25,
                duration: 0.9,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-[#111827] p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#1F2937]"
            >

              {/* STEP NUMBER */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white font-bold shadow-xl">
                {i + 1}
              </div>

              {/* ICON */}
              <div className="flex justify-center mb-6 mt-6">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-[#3B82F6] shadow-inner"
                >
                  <Icon size={32} />
                </motion.div>
              </div>

              <h3 className="font-bold text-xl mb-3 text-white">
                {step.title}
              </h3>

              <p className="text-[#9CA3AF]">
                {step.desc}
              </p>

              {/* glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 pointer-events-none"></div>

            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
