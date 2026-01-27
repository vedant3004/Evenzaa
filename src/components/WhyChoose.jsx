"use client"

import { ShieldCheck, Users, Building2, Headset } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  {
    icon: ShieldCheck,
    title: "Easy Event Planning",
    desc: "Plan and manage your events effortlessly in just a few minutes.",
  },
  {
    icon: Users,
    title: "Verified Vendor Network",
    desc: "5000+ trusted and verified vendors across multiple categories.",
  },
  {
    icon: Building2,
    title: "Premium Venues",
    desc: "Access to luxury venues perfect for weddings and corporate events.",
  },
  {
    icon: Headset,
    title: "24/7 Dedicated Support",
    desc: "Our support team is always available to assist you anytime.",
  },
]

export default function WhyChoose() {
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
        Why Choose EventZaa?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-[#9CA3AF] mb-16 max-w-2xl mx-auto"
      >
        We simplify event planning by connecting you with trusted vendors and
        premium services.
      </motion.p>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-4">
        {items.map((item, i) => {
          const Icon = item.icon

          return (
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
              className="relative bg-[#111827] p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#1F2937]"
            >

              {/* Glow layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 opacity-0 hover:opacity-100 transition" />

              {/* Icon */}
              <div className="flex justify-center mb-6 relative z-10">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-[#3B82F6] shadow-inner"
                >
                  <Icon size={32} />
                </motion.div>
              </div>

              <h3 className="font-bold text-xl mb-3 relative z-10 text-white">
                {item.title}
              </h3>

              <p className="text-[#9CA3AF] text-sm leading-relaxed relative z-10">
                {item.desc}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* TRUST BAR */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 flex justify-center gap-8 text-sm text-[#9CA3AF] flex-wrap"
      >
        <span>✔ Trusted by 10,000+ Customers</span>
        <span>✔ Secure & Transparent</span>
        <span>✔ Hassle-Free Booking</span>
      </motion.div>

    </section>
  )
}
