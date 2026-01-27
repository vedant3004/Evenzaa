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
      await loginVendor({
        email: f.email,
        password: f.password,
      })

      router.push("/vendor/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4">
      <div className="bg-[#0F172A] p-10 rounded-3xl shadow-2xl w-full max-w-md border border-[#1F2937]">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-cyan-900/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <Briefcase size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
          Vendor Portal
        </h2>

        <p className="text-center text-gray-400 mb-8">
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

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} EventZaa Vendor Panel
        </p>
      </div>
    </div>
  )
}
