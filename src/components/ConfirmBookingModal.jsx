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
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-extrabold mb-4 text-center">
          Confirm Your Booking
        </h2>

        {/* SUMMARY */}
        <div className="space-y-3 text-sm text-gray-700">

          <p><b>Vendor:</b> {vendor.name}</p>
          <p><b>Service:</b> {vendor.service}</p>

          <p className="text-pink-600 font-bold text-lg">
            ₹{vendor.price}
          </p>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-1" />
            <div>
              <p className="font-medium">
                {form.name} ({form.phone})
              </p>
              <p>{form.address}, {form.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Payment: Pay on Event (Cash)</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Confirm & Book
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
