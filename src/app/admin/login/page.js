"use client"
import { ADMIN } from "../../../config/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShieldCheck } from "lucide-react"

export default function AdminLogin() {
  const [f, setF] = useState({})
  const router = useRouter()

  const handleLogin = () => {
    if (f.username !== ADMIN.username || f.password !== ADMIN.password)
      return alert("Invalid Admin Credentials")

    localStorage.setItem("evenzaa_admin", "true")
    router.push("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2">Admin Portal</h2>
        <p className="text-center text-gray-500 mb-8">
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
          className="btn-primary w-full mt-6 text-lg"
        >
          Login to Dashboard
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EventZaa Admin Panel
        </p>
      </div>
    </div>
  )
}
