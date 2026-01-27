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
      <div className="pt-32 text-center text-[#9CA3AF]">
        Checking admin session...
      </div>
    )
  }

  return (
    <div className="pt-32 min-h-screen bg-[#0B1120] px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-10 text-white">
          Admin Dashboard
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div
            onClick={() => setView("vendors")}
            className="bg-[#111827] p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition border border-[#1F2937]"
          >
            <Store className="text-[#3B82F6]" size={32} />
            <div>
              <p className="text-[#9CA3AF]">Total Vendors</p>
              <h2 className="text-2xl font-bold text-white">
                {vendors.length}
              </h2>
            </div>
          </div>

          <div
            onClick={() => setView("users")}
            className="bg-[#111827] p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition border border-[#1F2937]"
          >
            <Users className="text-[#2563EB]" size={32} />
            <div>
              <p className="text-[#9CA3AF]">Total Users</p>
              <h2 className="text-2xl font-bold text-white">
                {users.length}
              </h2>
            </div>
          </div>

          <div className="bg-[#111827] p-8 rounded-2xl shadow-xl flex items-center gap-4 border border-[#1F2937]">
            <Wallet className="text-emerald-400" size={32} />
            <div>
              <p className="text-[#9CA3AF]">Total Revenue</p>
              <h2 className="text-2xl font-bold text-white">
                ₹{totalSales}
              </h2>
            </div>
          </div>

          <div className="bg-[#111827] p-8 rounded-2xl shadow-xl flex items-center gap-4 border border-[#1F2937]">
            <BarChart3 className="text-[#3B82F6]" size={32} />
            <div>
              <p className="text-[#9CA3AF]">Platform Growth</p>
              <h2 className="text-2xl font-bold text-white">
                Excellent
              </h2>
            </div>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="bg-[#111827] p-10 rounded-3xl shadow-2xl border border-[#1F2937]">

          {/* ===== VENDORS ===== */}
          {view === "vendors" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Registered Vendors
              </h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id} className="border-b border-[#1F2937] last:border-0">
                      <td className="py-3 font-semibold text-white">
                        {v.name}
                      </td>
                      <td className="py-3 text-[#9CA3AF]">
                        {v.email}
                      </td>
                      <td className="py-3 text-[#9CA3AF]">
                        {v.service_type || "-"}
                      </td>

                      <td className="py-3">
                        {v.approved ? (
                          <span className="text-emerald-400 font-semibold">
                            Approved
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        {!v.approved && (
                          <button
                            onClick={() => approveVendor(v.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:scale-105 transition"
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
              <h2 className="text-2xl font-bold mb-6 text-white">
                Registered Users
              </h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-b border-[#1F2937] last:border-0">
                      <td className="py-3 font-semibold text-white">
                        {u.name}
                      </td>
                      <td className="py-3 text-[#9CA3AF]">
                        {u.email}
                      </td>
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
