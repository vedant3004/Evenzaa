"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import vendors from "../../../data/vendors"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function BookingPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug)
  const router = useRouter()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  })

  const [useSaved, setUseSaved] = useState(false)
  const [editAddress, setEditAddress] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // ================= FETCH VENDOR =================
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/vendor/businesses/${slug}`,
          { cache: "no-store" }
        )

        if (res.ok) {
          const data = await res.json()
          setVendor({
            id: data.id,                 // vendor_business_id
            vendorId: data.vendor_id,    // vendor login id
            slug: data.slug,
            name: data.business_name,
            service: data.service_type,
            price: data.price,
            image: data.image || "/placeholder.jpg",
            location: data.city,
          })
        } else {
          setVendor(vendors.find(v => v.slug === slug) || null)
        }
      } catch {
        setVendor(vendors.find(v => v.slug === slug) || null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchVendor()
  }, [slug])

  // ================= LOAD SAVED ADDRESS =================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user_address") || "null")
    if (saved) {
      setForm(saved)
      setUseSaved(true)
    }
  }, [])

  if (loading) {
    return <div className="pt-32 text-center text-gray-400">Loading booking...</div>
  }

  if (!vendor) {
    return <div className="pt-32 text-center text-gray-400">Vendor not found</div>
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

  // ================= CREATE BOOKING =================
  const createBookingInDB = async () => {
    try {
      const token = localStorage.getItem("evenzaa_token")

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          vendorId: vendor.vendorId,
          vendorName: vendor.name,
          service: vendor.service,
          price: vendor.price,
          address: `${form.address}, ${form.city}`,
          vendor_business_id: vendor.id,
          customer_name: form.name,
          customer_phone: form.phone,
        }),
      })

      const data = await res.json()
      if (!res.ok) return null

      return data.id || data.bookingId || null
    } catch {
      return null
    }
  }

  // ================= UPDATE ADDRESS IN DB =================
  const updateBookingAddressInDB = async (bookingId) => {
    try {
      const token = localStorage.getItem("evenzaa_token")

      await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          address: `${form.address}, ${form.city}`,
          customer_name: form.name,
          customer_phone: form.phone,
        }),
      })
    } catch (err) {
      console.error("Address update failed", err)
    }
  }

  // ================= CONFIRM =================
  const confirmBooking = async () => {
    localStorage.setItem("user_address", JSON.stringify(form))

    let bookingId = null
    const pending = JSON.parse(
      localStorage.getItem("pendingBooking") || "null"
    )

    if (pending?.bookingId) {
      bookingId = pending.bookingId
      await updateBookingAddressInDB(bookingId)
    } else {
      bookingId = await createBookingInDB()
    }

    if (!bookingId) {
      alert("Booking failed. Please try again.")
      return
    }

    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        bookingId,
        vendorId: vendor.vendorId,
        vendorBusinessId: vendor.id,
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
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        Complete Your Booking
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* VENDOR */}
        <div className="bg-[#111827] p-8 rounded-2xl border border-[#1F2937]">
          <Image
            src={vendor.image}
            width={400}
            height={240}
            alt={vendor.name}
            className="rounded-xl mb-4 object-cover"
          />
          <h2 className="text-2xl font-bold text-white">{vendor.name}</h2>
          <p className="text-gray-400">{vendor.service}</p>
          <p className="text-blue-400 font-bold mt-3">₹{vendor.price}</p>
        </div>

        {/* ADDRESS */}
        <div className="bg-[#111827] p-8 rounded-2xl border border-[#1F2937]">
          <h2 className="text-2xl font-bold mb-4 text-white">Delivery Address</h2>

          {useSaved && !editAddress && (
            <div className="text-gray-300 space-y-2">
              <p><b>Name:</b> {form.name}</p>
              <p><b>Phone:</b> {form.phone}</p>
              <p><b>City:</b> {form.city}</p>
              <p><b>Address:</b> {form.address}</p>

              <button
                onClick={() => setEditAddress(true)}
                className="text-blue-400 underline mt-3"
              >
                ✏️ Edit Address
              </button>
            </div>
          )}

          {(!useSaved || editAddress) && (
            <div className="space-y-3">
              <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Full Name" />
              <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="Phone" />
              <input name="city" value={form.city} onChange={handleChange} className="input" placeholder="City" />
              <textarea name="address" value={form.address} onChange={handleChange} className="input" placeholder="Address" />

              {editAddress && (
                <button
                  onClick={() => {
                    localStorage.setItem("user_address", JSON.stringify(form))
                    setEditAddress(false)
                    setUseSaved(true)
                  }}
                  className="btn-primary w-full"
                >
                  Save Address
                </button>
              )}
            </div>
          )}

          {!editAddress && (
            <button onClick={openConfirmation} className="btn-primary w-full mt-6">
              Proceed to Payment
            </button>
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#111827] p-6 rounded-xl max-w-md w-full border border-[#1F2937]">
              <h3 className="text-xl font-bold mb-3 text-white">Confirm Address</h3>
              <p className="text-white">{form.name} • {form.phone}</p>
              <p className="text-gray-400">{form.address}, {form.city}</p>

              <div className="flex gap-4 mt-6">
                <button onClick={confirmBooking} className="btn-primary flex-1">
                  Continue
                </button>
                <button onClick={() => setShowModal(false)} className="border flex-1 rounded-lg text-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
