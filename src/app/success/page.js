"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Success() {
  const router = useRouter()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const last = JSON.parse(localStorage.getItem("lastBooking") || "null")
      setBooking(last)

      // Auto redirect after 6 sec
      setTimeout(() => router.push("/bookings"), 6000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full animate-fade-in">

        <div className="relative mb-6">
          <CheckCircle size={90} className="text-green-500 mx-auto animate-bounce" />
          <PartyPopper size={34} className="absolute -top-3 -right-3 text-yellow-500 animate-ping" />
        </div>

        <h1 className="text-4xl font-extrabold mb-2 text-gray-800">
          Booking Successful 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Your vendor has been booked successfully.
        </p>

        {/* BOOKING SUMMARY */}
        {booking && (
          <div className="bg-gray-100 rounded-xl p-4 text-sm text-left space-y-1 mb-6">
            <p><b>Vendor:</b> {booking.vendorName}</p>
            <p><b>Service:</b> {booking.service}</p>
            <p><b>Amount:</b> ₹{booking.price}</p>
            <p><b>Status:</b> {booking.status}</p>
          </div>
        )}

        <Link href="/bookings" className="btn-primary w-full block">
          View My Bookings
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to My Bookings in 6 seconds...
        </p>
      </div>
    </div>
  )
}
