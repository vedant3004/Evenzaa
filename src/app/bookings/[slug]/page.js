"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import vendors from "../../../data/vendors"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function BookingPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug)
  const router = useRouter()

  const vendor = vendors.find(v => v.slug === slug)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  })

  const [useSaved, setUseSaved] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // ✅ Load saved address safely
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user_address") || "null")
    if (saved) {
      setForm(saved)
      setUseSaved(true)
    }
  }, [])

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl font-semibold text-[#9CA3AF]">
        Vendor not found
      </div>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const openConfirmation = () => {
    if (!form.name || !form.phone || !form.city || !form.address) {
      alert("Fill all fields")
      return
    }
    setShowModal(true)
  }

  const confirmBooking = () => {
    localStorage.setItem("user_address", JSON.stringify(form))

    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        vendorId: vendor.id,
        vendorSlug: vendor.slug,
        vendorName: vendor.name,
        vendorImage: vendor.image,
        service: vendor.service,
        price: vendor.price,
        location: vendor.location,
        address: form,
        createdAt: new Date().toLocaleString(),
      })
    )

    router.push(`/payment/${vendor.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 max-w-6xl mx-auto px-4 bg-[#0B1120] min-h-screen"
    >
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-center mb-10 text-white"
      >
        Complete Your Booking
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* VENDOR CARD */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-[#111827] p-8 rounded-2xl shadow-xl border border-[#1F2937]"
        >
          <Image
            src={vendor.image}
            width={400}
            height={240}
            alt={vendor.name}
            className="rounded-xl mb-4 object-cover"
          />
          <h2 className="text-2xl font-bold text-white">
            {vendor.name}
          </h2>
          <p className="text-[#9CA3AF]">
            {vendor.service}
          </p>
          <p className="text-[#3B82F6] font-bold mt-3">
            ₹{vendor.price}
          </p>
        </motion.div>

        {/* ADDRESS */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#111827] p-8 rounded-2xl shadow-xl border border-[#1F2937]"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Delivery Address
          </h2>

          {useSaved && (
            <div className="bg-emerald-900/30 p-4 rounded-lg mb-4 text-sm text-emerald-400">
              <b>Saved Address Loaded</b>
              <button
                onClick={() => setUseSaved(false)}
                className="ml-3 underline text-[#3B82F6]"
              >
                Edit
              </button>
            </div>
          )}

          {!useSaved && (
            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Full Name"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="Phone"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input"
                placeholder="City"
              />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input"
                placeholder="Address"
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={openConfirmation}
            className="btn-primary w-full mt-6"
          >
            Proceed to Payment
          </motion.button>
        </motion.div>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-[#111827] p-6 rounded-xl max-w-md w-full shadow-2xl border border-[#1F2937]"
            >
              <h3 className="text-xl font-bold mb-3 text-white">
                Confirm Address
              </h3>
              <p className="font-medium text-white">
                {form.name} • {form.phone}
              </p>
              <p className="text-[#9CA3AF]">
                {form.address}, {form.city}
              </p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={confirmBooking}
                  className="btn-primary flex-1"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-[#1F2937] flex-1 rounded-lg text-[#9CA3AF]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
