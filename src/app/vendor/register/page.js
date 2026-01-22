"use client"

import { useState } from "react"
import { Crown, Star, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

const API = "http://localhost:5000/api/vendor"

export default function VendorRegister() {
  const router = useRouter()

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    business: "",
    username: "",
    password: "",
  })

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

  /* ================= PLAN SELECTION ================= */
  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">

        <h2 className="text-3xl font-extrabold mb-10">
          Choose Your Membership
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          {plans.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.name}
                className="bg-white p-8 rounded-3xl shadow-xl text-center hover:scale-105 transition cursor-pointer"
                onClick={() => setPlan(p.name)}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Icon size={26} />
                  </div>
                </div>

                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-pink-600 font-semibold my-2">
                  {p.price}
                </p>

                <ul className="text-gray-500 text-sm space-y-1">
                  {p.perks.map((x) => (
                    <li key={x}>✔ {x}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ================= REGISTER HANDLER ================= */
  const handleRegister = async () => {
    if (!form.business || !form.username || !form.password) {
      alert("Please fill all details")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.business,
          email: form.username,      // email = username
          password: form.password,
          service_type: plan,
          price: 0,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      alert(
        "Registration successful 🎉\n\nYour account is pending admin approval."
      )

      router.push("/vendor/login")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ================= REGISTER FORM ================= */
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
          <input
            placeholder="Business Name"
            className="input"
            value={form.business}
            onChange={(e) =>
              setForm({ ...form, business: e.target.value })
            }
          />

          <input
            placeholder="Email (Username)"
            type="email"
            className="input"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            placeholder="Password"
            type="password"
            className="input"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button
          className="btn-primary w-full mt-6"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EventZaa Vendor Membership
        </p>
      </div>
    </div>
  )
}
