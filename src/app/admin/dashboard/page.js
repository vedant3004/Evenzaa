"use client"

import { getVendors } from "../../../utils/vendorDB"
import { getUsers } from "../../../utils/userDB"
import { Users, Wallet, BarChart3, Store, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const VENDOR_API = "http://localhost:5000/api/vendor"

export default function AdminDash() {
  const router = useRouter()

  // OLD (local utils – untouched)
  const localVendors = getVendors()
  const users = getUsers()

  // NEW (backend vendors)
  const [vendors, setVendors] = useState([])

  const [view, setView] = useState("vendors")
  const [admin, setAdmin] = useState(false)

  const totalSales = localVendors.reduce(
    (sum, v) => sum + (v.sales || 0),
    0
  )

  // 🔐 ADMIN GUARD
  useEffect(() => {
    const a = localStorage.getItem("evenzaa_admin")
    if (!a) router.push("/admin/login")
    else setAdmin(true)
  }, [router])

  // 🔥 FETCH VENDORS FROM BACKEND
  useEffect(() => {
    fetch(VENDOR_API)
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(err => console.log(err))
  }, [])

  // ✅ APPROVE VENDOR
  const approveVendor = async (id) => {
    try {
      await fetch(`${VENDOR_API}/approve/${id}`, {
        method: "PUT",
      })

      setVendors(vendors.map(v =>
        v.id === id ? { ...v, approved: true } : v
      ))
    } catch (err) {
      alert("Approval failed")
    }
  }

  if (!admin) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Checking admin session...
      </div>
    )
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-10">Admin Dashboard</h1>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div
            onClick={() => setView("vendors")}
            className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition"
          >
            <Store className="text-pink-600" size={32} />
            <div>
              <p className="text-gray-500">Total Vendors</p>
              <h2 className="text-2xl font-bold">{vendors.length}</h2>
            </div>
          </div>

          <div
            onClick={() => setView("users")}
            className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition"
          >
            <Users className="text-purple-600" size={32} />
            <div>
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-2xl font-bold">{users.length}</h2>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4">
            <Wallet className="text-green-600" size={32} />
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h2 className="text-2xl font-bold">₹{totalSales}</h2>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4">
            <BarChart3 className="text-purple-600" size={32} />
            <div>
              <p className="text-gray-500">Platform Growth</p>
              <h2 className="text-2xl font-bold">Excellent</h2>
            </div>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl">

          {/* ===== VENDORS ===== */}
          {view === "vendors" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Registered Vendors</h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id} className="border-b last:border-0">
                      <td className="py-3 font-semibold">{v.name}</td>
                      <td className="py-3">{v.email}</td>
                      <td className="py-3">{v.service_type || "-"}</td>

                      <td className="py-3">
                        {v.approved ? (
                          <span className="text-green-600 font-semibold">
                            Approved
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        {!v.approved && (
                          <button
                            onClick={() => approveVendor(v.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:scale-105 transition"
                          >
                            <CheckCircle size={18} />
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ===== USERS ===== */}
          {view === "users" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Registered Users</h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-semibold">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
