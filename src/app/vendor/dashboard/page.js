"use client"

import { useEffect, useState } from "react"
import { BarChart3, Wallet, Crown, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VendorDash() {
  const router = useRouter()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  const [form, setForm] = useState({
    business: "",
    phone: "",
    city: "",
    description: "",
  })

  // ✅ SAFE localStorage access
  useEffect(() => {
    const stored = localStorage.getItem("evenzaa_vendor")
    if (stored) {
      const v = JSON.parse(stored)
      setVendor(v)
      setForm({
        business: v.business || "",
        phone: v.phone || "",
        city: v.city || "",
        description: v.description || "",
      })
    }
    setLoading(false)
  }, [])

  // ✅ VENDOR LOGOUT
  const logoutVendor = () => {
    localStorage.removeItem("evenzaa_vendor")
    router.push("/vendor/login")
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const saveProfile = () => {
    if (!form.business || !form.phone || !form.city) {
      alert("Please fill all required fields")
      return
    }

    const updatedVendor = {
      ...vendor,
      business: form.business,
      phone: form.phone,
      city: form.city,
      description: form.description,
    }

    localStorage.setItem("evenzaa_vendor", JSON.stringify(updatedVendor))
    setVendor(updatedVendor)
    setEditOpen(false)
  }

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        Vendor login required
      </div>
    )
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold">
            Welcome, {vendor.business}
          </h1>

          {/* 🔴 LOGOUT BUTTON */}
          <button
            onClick={logoutVendor}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-400 text-red-500 font-semibold hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-5">
            <Wallet className="text-pink-600" size={34} />
            <div>
              <p className="text-gray-500">Total Sales</p>
              <h2 className="text-2xl font-bold">
                ₹{vendor.sales || 0}
              </h2>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-5">
            <Crown className="text-yellow-500" size={34} />
            <div>
              <p className="text-gray-500">Membership</p>
              <h2 className="text-2xl font-bold">
                {vendor.plan || "Free"}
              </h2>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-5">
            <BarChart3 className="text-purple-600" size={34} />
            <div>
              <p className="text-gray-500">Performance</p>
              <h2 className="text-2xl font-bold">Excellent</h2>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Business Profile
            </h3>
            <p className="text-gray-500 mb-4">
              Manage your business details visible to customers
            </p>
            <button
              onClick={() => setEditOpen(true)}
              className="btn-primary w-full"
            >
              Edit Business Profile
            </button>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Bookings & Leads
            </h3>
            <p className="text-gray-500 mb-4">
              View customer enquiries and confirmed bookings
            </p>
            <a
              href="/vendor/dashboard/bookings"
              className="btn-primary w-full block text-center"
            >
              View Bookings
            </a>
          </div>
        </div>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-2xl">

            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h2 className="text-2xl font-extrabold mb-6">
              Edit Business Profile
            </h2>

            <div className="space-y-4">
              <input name="business" value={form.business} onChange={handleChange} className="input" placeholder="Business Name" />
              <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="Phone Number" />
              <input name="city" value={form.city} onChange={handleChange} className="input" placeholder="City" />
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input" placeholder="Business Description" />
            </div>

            <button
              onClick={saveProfile}
              className="mt-6 w-full btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
