"use client"

import { getVendors } from "../../../utils/vendorDB"
import { getUsers } from "../../../utils/userDB"
import {
  Users,
  Wallet,
  Store,
  CheckCircle,
  XCircle,
  Briefcase,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const VENDOR_API = "http://localhost:5000/api/vendor"
const ADMIN_API = "http://localhost:5000/api/admin"

// 🔐 JWT FORMAT CHECK
const isValidJWT = (token) => {
  if (!token || typeof token !== "string") return false
  return token.split(".").length === 3
}

export default function AdminDash() {
  const router = useRouter()

  // OLD (local utils – untouched)
  const localVendors = getVendors()
  const users = getUsers()

  // BACKEND STATES
  const [vendors, setVendors] = useState([])
  const [businesses, setBusinesses] = useState([])

  const [view, setView] = useState("vendors")
  const [admin, setAdmin] = useState(false)

  const totalSales = localVendors.reduce(
    (sum, v) => sum + (v.sales || 0),
    0
  )

  // 🔐 ADMIN GUARD (JWT SAFE)
  useEffect(() => {
    const token = localStorage.getItem("evenzaa_admin")

    if (!isValidJWT(token)) {
      localStorage.removeItem("evenzaa_admin")
      router.push("/admin/login")
    } else {
      setAdmin(true)
    }
  }, [router])

  // 🔥 FETCH VENDORS
  useEffect(() => {
    fetch(VENDOR_API)
      .then(res => res.json())
      .then(data => setVendors(Array.isArray(data) ? data : []))
      .catch(() => setVendors([]))
  }, [])

  // 🔥 FETCH PENDING BUSINESSES (JWT SAFE)
  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem("evenzaa_admin")

      if (!isValidJWT(token)) {
        localStorage.removeItem("evenzaa_admin")
        router.push("/admin/login")
        return
      }

      const res = await fetch(`${ADMIN_API}/businesses/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setBusinesses(data)
      } else if (Array.isArray(data.data)) {
        setBusinesses(data.data)
      } else {
        setBusinesses([])
      }
    } catch (err) {
      console.error(err)
      setBusinesses([])
    }
  }

  useEffect(() => {
    if (view === "businesses") fetchBusinesses()
  }, [view])

  // ✅ APPROVE BUSINESS
  const approveBusiness = async (id) => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      if (!isValidJWT(token)) return router.push("/admin/login")

      await fetch(`${ADMIN_API}/business/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      fetchBusinesses()
    } catch {
      alert("Approval failed")
    }
  }

  // ❌ REJECT BUSINESS
  const rejectBusiness = async (id) => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      if (!isValidJWT(token)) return router.push("/admin/login")

      await fetch(`${ADMIN_API}/business/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      fetchBusinesses()
    } catch {
      alert("Rejection failed")
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
          <Stat icon={<Store />} label="Vendors" value={vendors.length}
            onClick={() => setView("vendors")} />
          <Stat icon={<Users />} label="Users" value={users.length}
            onClick={() => setView("users")} />
          <Stat icon={<Briefcase />} label="Pending Businesses"
            value={businesses.length}
            onClick={() => setView("businesses")} />
          <Stat icon={<Wallet />} label="Revenue" value={`₹${totalSales}`} />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="bg-[#111827] p-10 rounded-3xl shadow-2xl border border-[#1F2937]">

          {/* ===== BUSINESS APPROVAL ===== */}
          {view === "businesses" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Business Approval Requests
              </h2>

              {businesses.length === 0 ? (
                <p className="text-gray-400">No pending businesses 🎉</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
                      <th>Business</th>
                      <th>Vendor</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map(b => (
                      <tr key={b.id} className="border-b border-[#1F2937]">
                        <td className="py-3 font-semibold text-white">
                          {b.business_name}
                        </td>
                        <td className="text-[#9CA3AF]">
                          {b.Vendor?.name || "-"}
                        </td>
                        <td className="text-[#9CA3AF]">{b.city}</td>
                        <td>
                          <span className="text-yellow-400 font-semibold">
                            Pending
                          </span>
                        </td>
                        <td className="flex gap-3 py-2">
                          <button
                            onClick={() => approveBusiness(b.id)}
                            className="px-3 py-2 bg-emerald-600 rounded-lg text-white flex gap-1"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() => rejectBusiness(b.id)}
                            className="px-3 py-2 bg-red-600 rounded-lg text-white flex gap-1"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* ===== VENDORS ===== */}
          {view === "vendors" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Registered Vendors
              </h2>
              <SimpleTable
                headers={["Name", "Email", "Service", "Status"]}
                rows={vendors.map(v => [
                  v.name,
                  v.email,
                  v.service_type || "-",
                  v.approved ? "Approved" : "Pending",
                ])}
              />
            </>
          )}

          {/* ===== USERS ===== */}
          {view === "users" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Registered Users
              </h2>
              <SimpleTable
                headers={["Name", "Email"]}
                rows={users.map(u => [u.name, u.email])}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= REUSABLE ================= */

const Stat = ({ icon, label, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#111827] p-6 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition border border-[#1F2937]"
  >
    <div className="text-blue-400">{icon}</div>
    <div>
      <p className="text-[#9CA3AF]">{label}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
  </div>
)

const SimpleTable = ({ headers, rows }) => (
  <table className="w-full text-left">
    <thead>
      <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
        {headers.map(h => (
          <th key={h} className="pb-3">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i} className="border-b border-[#1F2937]">
          {r.map((c, j) => (
            <td key={j} className="py-3 text-white">{c}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
