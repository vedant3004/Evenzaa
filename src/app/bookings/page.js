"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { MapPin, CreditCard, XCircle } from "lucide-react"

export default function Bookings() {
  const { user, loading, setOpen } = useAuth()
  const [data, setData] = useState([])
  const [cancelId, setCancelId] = useState(null)

  useEffect(() => {
    if (loading) return

    if (!user) {
      setOpen(true)
      return
    }

    const stored = JSON.parse(localStorage.getItem("bookings") || "[]")
    setData(stored)
  }, [user, loading])

  if (loading || !user) return null

  // ✅ FINAL FIXED CANCEL
  const confirmCancel = () => {
    const updated = data.map(b =>
      b.id === cancelId ? { ...b, status: "Cancelled" } : b
    )

    localStorage.setItem("bookings", JSON.stringify(updated))
    setData([...updated])   // 🔥 FORCE RERENDER
    setCancelId(null)
  }

  return (
    <div className="pt-32 max-w-6xl mx-auto px-4 pb-20">
      <h1 className="text-4xl font-extrabold mb-2">My Bookings</h1>
      <p className="text-gray-600 mb-10">Track, manage, and review your bookings.</p>

      {data.length === 0 && (
        <div className="bg-gray-50 p-12 rounded-2xl text-center shadow">
          <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
          <p className="text-gray-500">Book your first vendor now.</p>
        </div>
      )}

      <div className="grid gap-6">
        {data.map((b, i) => {
          const addr = typeof b.address === "object" ? b.address : {}

          return (
            <div key={b.id || i} className="bg-white p-6 rounded-2xl shadow-lg space-y-4">

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl">{b.vendorName}</h3>
                  <p className="text-gray-500">{b.service}</p>
                </div>

                <div className="flex gap-4 items-center">
                  <span className="font-bold text-pink-600">₹{b.price}</span>
                  <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    b.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex gap-3 text-sm text-gray-600">
                <MapPin size={18} />
                <div>
                  <p className="font-medium">
                    {(addr.name || "N/A")} ({addr.phone || "-"})
                  </p>
                  <p>
                    {(addr.address || "No address")} {addr.city ? `, ${addr.city}` : ""}
                  </p>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="flex gap-3 text-sm text-gray-600">
                <CreditCard size={18} />
                <span>{b.paymentMethod}</span>
              </div>

              {b.status !== "Cancelled" && (
                <button
                  onClick={() => setCancelId(b.id)}
                  className="flex items-center gap-2 text-red-600 font-semibold hover:underline"
                >
                  <XCircle size={18} />
                  Cancel Booking
                </button>
              )}
            </div>
          )
        })}
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Cancel Booking?</h2>
            <p className="text-gray-600 mb-6">Are you sure?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setCancelId(null)} className="border px-6 py-2 rounded-lg">
                No
              </button>
              <button onClick={confirmCancel} className="bg-red-600 text-white px-6 py-2 rounded-lg">
                Yes Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
