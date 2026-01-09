"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import vendors from "../../../data/vendors"
import { Star, MapPin, Phone } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { motion } from "framer-motion"

export default function VendorDetailPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug)
  const router = useRouter()
  const { user, setOpen } = useAuth()

  const vendor = vendors.find(v => v.slug === slug)

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        Vendor not found
      </div>
    )
  }

  const handleBook = () => {
    if (!user) {
      setOpen(true)
      return
    }
    router.push(`/bookings/${vendor.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pt-32 pb-20 max-w-6xl mx-auto px-4"
    >

      {/* ================= TOP SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">

        {/* IMAGE (PARALLAX ZOOM) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.04 }}
          className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={vendor.image}
            fill
            alt={vendor.name}
            className="object-cover"
          />
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          <motion.h1
            variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="text-4xl font-extrabold mb-2"
          >
            {vendor.name}
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-pink-600 font-semibold mb-3"
          >
            {vendor.service}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex items-center gap-4 text-gray-600 mb-4"
          >
            <span className="flex items-center gap-1">
              <Star size={18} className="text-yellow-500" />
              {vendor.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={18} />
              {vendor.location}
            </span>
          </motion.div>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-gray-700 mb-6"
          >
            {vendor.description}
          </motion.p>

          <motion.p
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="text-2xl font-bold text-pink-600 mb-6"
          >
            Starting from ₹{vendor.price}
          </motion.p>

          {/* ACTION BUTTONS */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex gap-4 flex-wrap"
          >
            {/* BOOK NOW */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBook}
              className="btn-primary"
            >
              Book Now
            </motion.button>

            {/* WHATSAPP */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={`https://wa.me/${vendor.whatsapp}`}
              target="_blank"
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-green-500 text-green-600 hover:bg-green-50 transition"
            >
              <Phone size={18} />
              WhatsApp
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= SERVICES ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-2xl font-bold mb-6"
        >
          Services Offered
        </motion.h2>

        <ul className="grid sm:grid-cols-2 gap-4">
          {vendor.services.map((s) => (
            <motion.li
              key={s}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="px-4 py-3 rounded-lg bg-pink-50 font-medium"
            >
              ✔ {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>

    </motion.div>
  )
}
