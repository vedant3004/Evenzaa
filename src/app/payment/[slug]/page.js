"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import vendors from "../../../data/vendors"
import { CheckCircle } from "lucide-react"

export default function PaymentPage() {
  const { slug } = useParams()
  const router = useRouter()
  const vendor = vendors.find(v => v.slug === slug)

  const [data, setData] = useState(null)
  const [method, setMethod] = useState("cash")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("pendingBooking") || "null")
      setData(stored)
    }
  }, [])

  if (!vendor || !data) return null

  const confirmPayment = () => {
    const finalBooking = {
      id: Date.now(),
      ...data,
      paymentMethod: method === "cash" ? "Pay on Event (Cash)" : "UPI",
      status: "Confirmed",
      paidAt: new Date().toLocaleString(),
    }

    const old = JSON.parse(localStorage.getItem("bookings") || "[]")
    localStorage.setItem("bookings", JSON.stringify([...old, finalBooking]))

    // 🔥 Save for success page animation
    localStorage.setItem("lastBooking", JSON.stringify(finalBooking))

    localStorage.removeItem("pendingBooking")

    router.push("/success")   // 👉 redirect to animated success page
  }

  return (
    <div className="pt-32 max-w-4xl mx-auto px-4 pb-20">

      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Payment for {vendor.name}
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">

        <div className="space-y-2 text-gray-700">
          <p><b>Service:</b> {vendor.service}</p>
          <p><b>Amount:</b> ₹{vendor.price}</p>
          <p><b>Name:</b> {data.address?.name}</p>
          <p><b>Phone:</b> {data.address?.phone}</p>
          <p><b>City:</b> {data.address?.city}</p>
          <p><b>Address:</b> {data.address?.address}</p>
        </div>

        <h2 className="text-xl font-bold">Select Payment Method</h2>

        <label className="flex gap-2">
          <input type="radio" checked={method==="cash"} onChange={()=>setMethod("cash")} />
          Pay on Event (Cash)
        </label>

        <label className="flex gap-2">
          <input type="radio" checked={method==="upi"} onChange={()=>setMethod("upi")} />
          UPI Payment
        </label>

        <button
          onClick={confirmPayment}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
        >
          <CheckCircle size={18} />
          Confirm & Complete Booking
        </button>
      </div>
    </div>
  )
}
