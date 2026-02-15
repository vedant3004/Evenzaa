"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

export default function PaymentPage() {
  const { id } = useParams()

  const [method, setMethod] = useState("UPI")

  const handlePayment = async () => {
    alert("Payment Successful (Demo Mode)")
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Membership Payment</h1>

      <div className="bg-[#111827] p-8 rounded-2xl max-w-xl">

        <h2 className="text-xl mb-4">Business ID: {id}</h2>

        <label className="block mb-2">Select Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 bg-[#0F172A] rounded-xl mb-6"
        >
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
        </select>

        <button
          onClick={handlePayment}
          className="w-full bg-green-600 py-3 rounded-xl"
        >
          Pay Now
        </button>

      </div>
    </div>
  )
}
