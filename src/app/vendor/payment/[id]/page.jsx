"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CreditCard, Landmark, Smartphone } from "lucide-react"

const API_BASE = "http://localhost:5000"

export default function VendorPayment() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [business, setBusiness] = useState(null)
  const [method, setMethod] = useState("upi")

  // 🔥 Fetch business details
  useEffect(() => {
    const fetchBusiness = async () => {
      const token = localStorage.getItem("evenzaa_token")

      const res = await fetch(`${API_BASE}/api/vendor/business/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
})


      const data = await res.json()
      setBusiness(data)
    }

    fetchBusiness()
  }, [id])

  const handlePayment = async () => {
    const token = localStorage.getItem("evenzaa_token")
    setLoading(true)

    await fetch(`${API_BASE}/api/vendor/pay/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_method: method,
      }),
    })

    alert("Payment submitted successfully. Waiting for admin approval.")
    router.push("/vendor/dashboard")
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        Loading payment details...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-[#111827] border border-[#1F2937] rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - PLAN SUMMARY */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Membership Summary
          </h2>

          <div className="space-y-4 text-gray-300">

            <div className="flex justify-between">
              <span>Business</span>
              <span className="font-semibold text-white">
                {business.business_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-semibold text-white">
                {business.category || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Selected Plan</span>
              <span className="font-semibold text-yellow-400">
                {business.service_type}
              </span>
            </div>

            <div className="border-t border-[#1F2937] pt-4 flex justify-between text-lg">
              <span>Total Amount</span>
              <span className="font-bold text-green-400">
  ₹{business.membership_price}
</span>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PAYMENT METHODS */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Choose Payment Method
          </h2>

          <div className="space-y-4">

            {/* UPI */}
            <div
              onClick={() => setMethod("upi")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                method === "upi"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-[#1F2937]"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <Smartphone />
                UPI (Google Pay / PhonePe / Paytm)
              </div>
            </div>

            {/* CARD */}
            <div
              onClick={() => setMethod("card")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                method === "card"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-[#1F2937]"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <CreditCard />
                Debit / Credit Card
              </div>
            </div>

            {/* NETBANKING */}
            <div
              onClick={() => setMethod("netbanking")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                method === "netbanking"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-[#1F2937]"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <Landmark />
                Net Banking
              </div>
            </div>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold text-lg transition"
          >
            {loading ? "Processing..." : `Pay ₹${business.membership_price}`}

          </button>

          <p className="text-xs text-gray-500 mt-4">
            Secure payment powered by Evenzaa Secure Gateway 🔒
          </p>
        </div>

      </div>
    </div>
  )
}
