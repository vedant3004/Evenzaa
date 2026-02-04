"use client"

import { useEffect, useState } from "react"
import { MapPin, CheckCircle, XCircle } from "lucide-react"

const BOOKING_API = "http://localhost:5000/api/bookings"

export default function VendorBookings() {
  const [vendor, setVendor] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // ================= FETCH BOOKINGS FROM BACKEND =================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const stored = localStorage.getItem("evenzaa_vendor")
        const token = localStorage.getItem("evenzaa_token") // 🔥 FIX

        if (!stored || !token) {
          setLoading(false)
          return
        }

        const vendorData = JSON.parse(stored)
        setVendor(vendorData)

        const res = await fetch(`${BOOKING_API}/vendor`, {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 FIXED
          },
        })

        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("❌ Vendor booking fetch error:", err)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // ================= UPDATE BOOKING STATUS (🔥 BACKEND CONNECTED) =================
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("evenzaa_token") // 🔥 FIX
      if (!token) return

      const res = await fetch(`${BOOKING_API}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 FIXED
        },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // ✅ UPDATE UI AFTER DB UPDATE
      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, status } : b
        )
      )
    } catch (err) {
      console.error("❌ Status update error:", err)
      alert("Failed to update booking status")
    }
  }

  // ================= TOTAL EARNINGS =================
  const totalEarnings = bookings
    .filter(b => b.status === "paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0)

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading bookings...
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl font-semibold text-gray-300">
        Vendor login required
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-4 bg-[#0B1120] min-h-screen">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-white">
          My Bookings
        </h1>
        <p className="text-gray-400">
          Manage customer bookings and view details
        </p>

        <p className="mt-3 text-lg font-semibold text-cyan-400">
          Total Earnings: ₹{totalEarnings}
        </p>
      </div>

      {/* EMPTY */}
      {bookings.length === 0 && (
        <div className="bg-[#111827] border border-[#1F2937] p-12 rounded-2xl text-center shadow">
          <h3 className="text-xl font-bold mb-2 text-white">
            No bookings yet
          </h3>
          <p className="text-gray-400">
            Customer bookings will appear here.
          </p>
        </div>
      )}

      {/* BOOKINGS LIST */}
      <div className="grid gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl shadow-lg space-y-4"
          >
            {/* TOP */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-white">
                  Booking #{b.id}
                </h3>
                <p className="text-gray-400">
                  Date: {b.date} | Time: {b.time || "—"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-cyan-400 text-lg">
                  ₹{b.amount || 0}
                </span>

                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    b.status === "paid"
                      ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700"
                      : "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>

            {/* CUSTOMER DETAILS */}
            <div className="flex gap-3 text-sm text-gray-400">
              <MapPin size={18} />
              <div>
                <p className="font-medium text-gray-200">
                  {b.customer_name || "Customer"}
                  {b.customer_phone && ` (${b.customer_phone})`}
                </p>
                <p>
                  {b.customer_address || "Address not provided"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {b.status === "pending" && (
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => updateStatus(b.id, "paid")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  <CheckCircle size={18} />
                  Mark Paid
                </button>

                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
