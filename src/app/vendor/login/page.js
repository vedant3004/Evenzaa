"use client"
import { findVendor } from "../../../utils/vendorDB"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Briefcase } from "lucide-react"

export default function VendorLogin() {
  const [f, setF] = useState({})
  const router = useRouter()

  const handleLogin = () => {
    const v = findVendor(f.username, f.password)
    if (!v) return alert("Invalid Vendor Credentials")
    localStorage.setItem("evenzaa_vendor", JSON.stringify(v))
    router.push("/vendor/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Briefcase size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2">Vendor Portal</h2>
        <p className="text-center text-gray-500 mb-8">
          Login to manage your business & bookings
        </p>

        <div className="space-y-4">
          <input
            placeholder="Vendor Username"
            className="input"
            onChange={e => setF({ ...f, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            onChange={e => setF({ ...f, password: e.target.value })}
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
