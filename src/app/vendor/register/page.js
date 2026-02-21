"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const API = "http://localhost:5000/api/vendor"

export default function VendorRegister() {
  const router = useRouter()

  // Default plan fixed to Gold
  const plan = "Gold"

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    business: "",
    username: "",
    password: "",
  })

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
          email: form.username,
          password: form.password,
          service_type: plan, // Always Gold
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4">

      <div className="bg-[#0F172A] border border-[#1F2937] p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
          Gold Membership Registration
        </h2>

        <p className="text-center text-gray-400 mb-8">
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

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} EventZaa Vendor Membership
        </p>
      </div>
    </div>
  )
}