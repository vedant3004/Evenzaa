"use client"

import { X, CheckCircle, MapPin, CreditCard } from "lucide-react"

export default function ConfirmBookingModal({
  open,
  onClose,
  onConfirm,
  vendor,
  form,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-[#111827] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn border border-[#1F2937] text-white">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition"
        >
          <X />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-extrabold mb-4 text-center text-white">
          Confirm Your Booking
        </h2>

        {/* SUMMARY */}
        <div className="space-y-3 text-sm text-[#D1D5DB]">

          <p><b className="text-white">Vendor:</b> {vendor.name}</p>
          <p><b className="text-white">Service:</b> {vendor.service}</p>

          <p className="text-[#3B82F6] font-bold text-lg">
            ₹{vendor.price}
          </p>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-1 text-[#9CA3AF]" />
            <div>
              <p className="font-medium text-white">
                {form.name} ({form.phone})
              </p>
              <p className="text-[#9CA3AF]">
                {form.address}, {form.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#9CA3AF]" />
            <span>Payment: Pay on Event (Cash)</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Confirm & Book
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#1F2937] font-semibold text-[#D1D5DB] hover:bg-[#0F172A] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
