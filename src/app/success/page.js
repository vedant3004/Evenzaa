"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Success() {
  const router = useRouter()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const last = JSON.parse(
      localStorage.getItem("lastBooking") || "null"
    )

    setBooking(last)

    // 🔥 AUTO REDIRECT AFTER 6s
    const timer = setTimeout(() => {
      router.push("/bookings")
    }, 6000)

    // ✅ CLEANUP (important)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4">

      <div className="bg-[#111827] rounded-3xl shadow-2xl p-10 text-center max-w-md w-full
                      animate-fade-in border border-[#1F2937]">

        {/* ICONS */}
        <div className="relative mb-6 flex justify-center">
          <CheckCircle
            size={90}
            className="text-emerald-400 animate-bounce"
          />
          <PartyPopper
            size={34}
            className="absolute -top-3 -right-3 text-yellow-400 animate-ping"
          />
        </div>

        <h1 className="text-4xl font-extrabold mb-2 text-white">
          Booking Successful 🎉
        </h1>

        <p className="text-[#9CA3AF] mb-6">
          Your vendor has been booked successfully.
        </p>

        {/* ================= BOOKING SUMMARY ================= */}
        {booking ? (
          <div className="bg-[#0F172A] rounded-xl p-4 text-sm text-left
                          space-y-1 mb-6 text-[#9CA3AF]
                          border border-[#1F2937]">

            {booking.bookingId && (
              <p>
                <b className="text-white">Booking ID:</b>{" "}
                #{booking.bookingId}
              </p>
            )}

            <p>
              <b className="text-white">Vendor:</b>{" "}
              {booking.vendorName}
            </p>

            <p>
              <b className="text-white">Service:</b>{" "}
              {booking.service}
            </p>

            <p>
              <b className="text-white">Amount:</b>{" "}
              ₹{booking.price}
            </p>

            <p>
              <b className="text-white">Status:</b>{" "}
              {booking.status}
            </p>

            {booking.paymentMethod && (
              <p>
                <b className="text-white">Payment:</b>{" "}
                {booking.paymentMethod}
              </p>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-sm mb-6">
            Booking details not available.
          </div>
        )}

        {/* CTA */}
        <Link href="/bookings" className="btn-primary w-full block">
          View My Bookings
        </Link>

        <p className="text-xs text-[#9CA3AF] mt-4">
          Redirecting to My Bookings in 6 seconds...
        </p>
      </div>
    </div>
  )
}
