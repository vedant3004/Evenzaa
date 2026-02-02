"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import vendors from "../../../data/vendors" // 🔁 fallback (not removed)
import { CheckCircle } from "lucide-react"

export default function PaymentPage() {
  const { slug } = useParams()
  const router = useRouter()

  const [data, setData] = useState(null)
  const [method, setMethod] = useState("cash")

  // 🔥 GET DATA FROM LOCALSTORAGE (PRIMARY SOURCE)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(
        localStorage.getItem("pendingBooking") || "null"
      )
      setData(stored)
    }
  }, [])

  // 🔁 BACKUP: static vendor (never blocks UI)
  const vendor =
    data || vendors.find(v => v.slug === slug) || null

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading payment...
      </div>
    )
  }

  const confirmPayment = () => {
    const finalBooking = {
      id: Date.now(),
      ...data,
      paymentMethod: method === "cash"
        ? "Pay on Event (Cash)"
        : "UPI",
      status: "Confirmed",
      paidAt: new Date().toLocaleString(),
    }

    const old = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    )
    localStorage.setItem(
      "bookings",
      JSON.stringify([...old, finalBooking])
    )

    // 🔥 Success page animation
    localStorage.setItem(
      "lastBooking",
      JSON.stringify(finalBooking)
    )

    localStorage.removeItem("pendingBooking")
    router.push("/success")
  }

  return (
    <div className="pt-32 max-w-4xl mx-auto px-4 pb-20 bg-[#0B1120] min-h-screen">

      <h1 className="text-4xl font-extrabold mb-10 text-center text-white">
        Payment for {vendor.vendorName || vendor.name}
      </h1>

      <div className="bg-[#111827] p-8 rounded-2xl shadow-lg space-y-6 border border-[#1F2937]">

        <div className="space-y-2 text-[#9CA3AF]">
          <p>
            <b className="text-white">Service:</b>{" "}
            {vendor.service}
          </p>
          <p>
            <b className="text-white">Amount:</b>{" "}
            ₹{vendor.price}
          </p>
          <p>
            <b className="text-white">Name:</b>{" "}
            {vendor.address?.name}
          </p>
          <p>
            <b className="text-white">Phone:</b>{" "}
            {vendor.address?.phone}
          </p>
          <p>
            <b className="text-white">City:</b>{" "}
            {vendor.address?.city}
          </p>
          <p>
            <b className="text-white">Address:</b>{" "}
            {vendor.address?.address}
          </p>
        </div>

        <h2 className="text-xl font-bold text-white">
          Select Payment Method
        </h2>

        <label className="flex gap-2 text-[#9CA3AF] items-center">
          <input
            type="radio"
            checked={method === "cash"}
            onChange={() => setMethod("cash")}
          />
          Pay on Event (Cash)
        </label>

        <label className="flex gap-2 text-[#9CA3AF] items-center">
          <input
            type="radio"
            checked={method === "upi"}
            onChange={() => setMethod("upi")}
          />
          UPI Payment
        </label>

        <button
          onClick={confirmPayment}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold hover:scale-105 transition"
        >
          <CheckCircle size={18} />
          Confirm & Complete Booking
        </button>
      </div>
    </div>
  )
}
