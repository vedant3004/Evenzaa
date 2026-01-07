"use client"
import { saveVendor } from "../../../utils/vendorDB"
import { useState } from "react"
import { Crown, Star, Shield } from "lucide-react"

export default function VendorRegister() {
  const [plan, setPlan] = useState(null)
  const [form, setForm] = useState({})

  const plans = [
    {
      name: "Bronze",
      icon: Shield,
      price: "₹499 / month",
      perks: ["Basic Listing", "Limited Leads", "Email Support"],
    },
    {
      name: "Silver",
      icon: Star,
      price: "₹999 / month",
      perks: ["Featured Listing", "More Leads", "Priority Support"],
    },
    {
      name: "Gold",
      icon: Crown,
      price: "₹1999 / month",
      perks: ["Top Placement", "Unlimited Leads", "Dedicated Manager"],
    },
  ]

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">

        <h2 className="text-3xl font-extrabold mb-10">Choose Your Membership</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          {plans.map(p => {
            const Icon = p.icon
            return (
              <div key={p.name}
                className="bg-white p-8 rounded-3xl shadow-xl text-center hover:scale-105 transition cursor-pointer"
                onClick={() => setPlan(p.name)}>

                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Icon size={26} />
                  </div>
                </div>

                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-pink-600 font-semibold my-2">{p.price}</p>
                <ul className="text-gray-500 text-sm space-y-1">
                  {p.perks.map(x => <li key={x}>✔ {x}</li>)}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-2">
          {plan} Membership Registration
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Create your vendor account to start receiving leads
        </p>

        <div className="space-y-4">
          <input placeholder="Business Name" className="input"
            onChange={e => setForm({ ...form, business: e.target.value })} />

          <input placeholder="Create Username" className="input"
            onChange={e => setForm({ ...form, username: e.target.value })} />

          <input placeholder="Create Password" type="password" className="input"
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn-primary w-full mt-6" onClick={() => {
          if (!form.business || !form.username || !form.password)
            return alert("Fill all details")

          saveVendor({ ...form, plan, sales: 0 })
          alert("Registration Successful")
          location.href = "/vendor/login"
        }}>
          Complete Registration
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EventZaa Vendor Membership
        </p>
      </div>
    </div>
  )
}
