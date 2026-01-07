"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import vendors from "../../../data/vendors"
import { MapPin, CheckCircle, X } from "lucide-react"
import Image from "next/image"

export default function BookingPage() {
  const { slug } = useParams()
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

  // ✅ SAFE load saved address
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("user_address") || "null")
      if (saved) {
        setForm(saved)
        setUseSaved(true)
      }
    }
  }, [])

  if (!vendor) return <div className="pt-32 text-center">Vendor not found</div>

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const openConfirmation = () => {
    if (!form.name || !form.phone || !form.city || !form.address)
      return alert("Fill all fields")
    setShowModal(true)
  }

  const confirmBooking = () => {
    // ✅ SAVE ADDRESS FOR FUTURE AUTO LOAD
    localStorage.setItem("user_address", JSON.stringify(form))

    // ✅ SAVE TEMP BOOKING FOR PAYMENT PAGE (IMAGE ADDED 🔥)
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        vendorId: vendor.id,
        vendorSlug: vendor.slug,
        vendorName: vendor.name,
        vendorImage: vendor.image,        // 👈 NEW
        service: vendor.service,
        price: vendor.price,
        location: vendor.location,
        address: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          address: form.address,
        },
        createdAt: new Date().toLocaleString(),
      })
    )

    router.push(`/payment/${vendor.slug}`)
  }

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Complete Your Booking
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* VENDOR CARD */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <Image
            src={vendor.image}
            width={400}
            height={240}
            className="rounded-xl mb-4 object-cover"
            alt={vendor.name}
          />
          <h2 className="text-2xl font-bold">{vendor.name}</h2>
          <p className="text-gray-500">{vendor.service}</p>
          <p className="text-pink-600 font-bold mt-3">₹{vendor.price}</p>
        </div>

        {/* ADDRESS */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

          {useSaved && (
            <div className="bg-green-50 p-4 rounded-lg mb-4 text-sm">
              <b>Saved Address Loaded</b>
              <button
                onClick={() => setUseSaved(false)}
                className="ml-3 underline text-pink-600"
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

          <button onClick={openConfirmation} className="btn-primary w-full mt-6">
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-3">Confirm Address</h3>
            <p className="font-medium">
              {form.name} • {form.phone}
            </p>
            <p>
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
                className="border flex-1 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
