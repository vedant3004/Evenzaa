"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Briefcase } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"

export default function VendorLogin() {
  const [f, setF] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const { loginVendor } = useAuth()

  const handleLogin = async () => {
    if (!f.email || !f.password) {
      alert("Please enter email & password")
      return
    }

    try {
      // 🔥 AuthContext handles backend + storage
      await loginVendor({
        email: f.email,
        password: f.password,
      })

      // ✅ LOGIN SUCCESS → DASHBOARD
      router.push("/vendor/dashboard")
    } catch (err) {
      // safety (normally error already handled in context)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Briefcase size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2">
          Vendor Portal
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Login to manage your business & bookings
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Vendor Email"
            className="input"
            value={f.email}
            onChange={(e) =>
              setF({ ...f, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={f.password}
            onChange={(e) =>
              setF({ ...f, password: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full mt-6 text-lg"
        >
          Login to Dashboard
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EventZaa Vendor Panel
        </p>
      </div>
    </div>
  )
}