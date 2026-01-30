"use client"

import { ADMIN } from "../../../config/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"

const ADMIN_API = "http://localhost:5000/api/admin"

export default function AdminLogin() {
  const [f, setF] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { loginAdmin } = useAuth() // 🔥 CENTRAL AUTH

  const handleLogin = async () => {
    if (f.username !== ADMIN.username || f.password !== ADMIN.password) {
      return alert("Invalid Admin Credentials")
    }

    try {
      setLoading(true)

      // 🔥 STEP 1: Get REAL JWT from backend
      const res = await fetch(`${ADMIN_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: f.username,
          password: f.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.token) {
        return alert("Admin login failed")
      }

      // 🔥 STEP 2: Store REAL JWT (THIS FIXES jwt malformed)
      localStorage.setItem("evenzaa_admin", data.token)

      // 🔥 STEP 3: Central auth (navbar / guards)
      loginAdmin({
        username: f.username,
        token: data.token,
      })

      router.push("/admin/dashboard")
    } catch (err) {
      console.error(err)
      alert("Server error during admin login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <div className="bg-[#111827] p-10 rounded-3xl shadow-2xl w-full max-w-md border border-[#1F2937]">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-[#3B82F6]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
          Admin Portal
        </h2>

        <p className="text-center text-[#9CA3AF] mb-8">
          Secure access for EventZaa administrators
        </p>

        <div className="space-y-4">
          <input
            placeholder="Admin Username"
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
          disabled={loading}
          className="btn-primary w-full mt-6 text-lg"
        >
          {loading ? "Logging in..." : "Login to Dashboard"}
        </button>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          © {new Date().getFullYear()} EventZaa Admin Panel
        </p>
      </div>
    </div>
  )
}
