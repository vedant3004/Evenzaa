"use client"

import { useEffect, useState } from "react"
import { MapPin, CheckCircle, XCircle } from "lucide-react"

export default function VendorBookings() {
  const [vendor, setVendor] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const v = localStorage.getItem("evenzaa_vendor")
    if (!v) {
      setLoading(false)
      return
    }

    const vendorData = JSON.parse(v)
    setVendor(vendorData)

    const all = JSON.parse(localStorage.getItem("bookings") || "[]")

    const filtered = all.filter(
      (b) => b.vendorId === vendorData.id
    )

    setBookings(filtered)
    setLoading(false)
  }, [])

  const updateStatus = (id, status) => {
    const all = JSON.parse(localStorage.getItem("bookings") || "[]")

    const updated = all.map((b) =>
      b.id === id ? { ...b, status } : b
    )

    localStorage.setItem("bookings", JSON.stringify(updated))

    setBookings(updated.filter(b => b.vendorId === vendor.id))
  }

  const totalEarnings = bookings
    .filter(b => b.status === "Confirmed")
    .reduce((sum, b) => sum + Number(b.price), 0)

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
          Manage customer bookings and update status
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
                  {b.vendorName}
                </h3>
                <p className="text-gray-400">
                  {b.service}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-cyan-400 text-lg">
                  ₹{b.price}
                </span>

                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    b.status === "Cancelled"
                      ? "bg-red-900/40 text-red-400 border border-red-700"
                      : b.status === "Confirmed"
                      ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700"
                      : "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="flex gap-3 text-sm text-gray-400">
              <MapPin size={18} />
              <div>
                <p className="font-medium text-gray-200">
                  {b.address?.name} ({b.address?.phone})
                </p>
                <p>
                  {b.address?.address}, {b.address?.city}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {b.status === "Pending" && (
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => updateStatus(b.id, "Confirmed")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(b.id, "Cancelled")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
