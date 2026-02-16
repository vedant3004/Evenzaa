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
  Trash2, // 🆕 ADDED
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const VENDOR_API = "http://localhost:5000/api/vendor"
const ADMIN_API = "http://localhost:5000/api/admin"
const AUTH_API = "http://localhost:5000/api/auth"

// 🔐 JWT FORMAT CHECK
const isValidJWT = (token) => {
  if (!token || typeof token !== "string") return false
  return token.split(".").length === 3
}

export default function AdminDash() {
  const router = useRouter()

  // OLD (local utils – untouched)
  const localVendors = getVendors()
  const localUsers = getUsers() // dummy

  // BACKEND STATES
  const [vendors, setVendors] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [users, setUsers] = useState([])

  const [view, setView] = useState("vendors")
  const [admin, setAdmin] = useState(false)

  const [payments, setPayments] = useState([])
const [revenueView, setRevenueView] = useState(false)
const [totalRevenue, setTotalRevenue] = useState(0)


  // 🔐 ADMIN GUARD
  useEffect(() => {
    const token = localStorage.getItem("evenzaa_admin")
    if (!isValidJWT(token)) {
      localStorage.removeItem("evenzaa_admin")
      router.push("/admin/login")
    } else {
      setAdmin(true)
    }
  }, [router])

  // ================= FETCH VENDORS =================
  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      if (!isValidJWT(token)) return

      const res = await fetch(VENDOR_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setVendors(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("❌ Vendor fetch error:", err)
      setVendors([])
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
  fetchPayments()
}, [])


  // ================= FETCH PAYMENTS =================
const fetchPayments = async () => {
  try {
    const token = localStorage.getItem("evenzaa_admin")
    if (!isValidJWT(token)) return

    const res = await fetch(`${ADMIN_API}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (Array.isArray(data)) {
      setPayments(data)

      const total = data.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      )

      setTotalRevenue(total)
    }

  } catch (err) {
    console.error("❌ Payment fetch error:", err)
  }
}


  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("evenzaa_admin")
        if (!isValidJWT(token)) return

        const res = await fetch(`${AUTH_API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("❌ User fetch error:", err)
        setUsers([])
      }
    }

    fetchUsers()
  }, [])

  // ================= FETCH PENDING BUSINESSES =================
  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      if (!isValidJWT(token)) return router.push("/admin/login")

      const res = await fetch(`${ADMIN_API}/businesses/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setBusinesses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setBusinesses([])
    }
  }
// ✅ LOAD & AUTO REFRESH PENDING BUSINESSES COUNT
useEffect(() => {
  fetchBusinesses()   // page load pe count laayega

  const interval = setInterval(() => {
    fetchBusinesses()  // har 15 sec me update
  }, 15000)

  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    if (view === "businesses") fetchBusinesses()
  }, [view])

    // ✅ LOAD PENDING BUSINESSES COUNT ON PAGE LOAD
  useEffect(() => {
    fetchBusinesses()
  }, [])


  // ✅ LOAD PENDING COUNT ON PAGE LOAD
useEffect(() => {
  fetchBusinesses()
}, [])


  // ================= APPROVE / REJECT BUSINESS =================
  const approveBusiness = async (id) => {
    const token = localStorage.getItem("evenzaa_admin")
    await fetch(`${ADMIN_API}/business/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchBusinesses()
  }

  const rejectBusiness = async (id) => {
    const token = localStorage.getItem("evenzaa_admin")
    await fetch(`${ADMIN_API}/business/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchBusinesses()
  }

  // ================= APPROVE / REJECT VENDOR =================
  const approveVendor = async (id) => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      await fetch(`${VENDOR_API}/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchVendors()
    } catch {
      alert("Vendor approval failed")
    }
  }

  const rejectVendor = async (id) => {
    try {
      const token = localStorage.getItem("evenzaa_admin")
      await fetch(`${VENDOR_API}/reject/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchVendors()
    } catch {
      alert("Vendor rejection failed")
    }
  }

  // ================= DELETE VENDOR (🆕 ONLY ADDITION) =================
  const deleteVendor = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to permanently delete this vendor?"
    )
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("evenzaa_admin")

      const res = await fetch(`${ADMIN_API}/vendor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Delete failed")

      // UI se turant remove
      setVendors((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      alert("❌ Vendor delete failed")
      console.error(err)
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
          <Stat
  icon={<Wallet />}
  label="Revenue"
  value={`₹${totalRevenue}`}
 onClick={() => {
  setView("")
  setRevenueView(true)
}}

/>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="bg-[#111827] p-10 rounded-3xl shadow-2xl border border-[#1F2937]">

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

          {/* ===== VENDORS ===== */}
          {view === "vendors" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Registered Vendors
              </h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id} className="border-b border-[#1F2937]">
                      <td className="py-3 text-white">{v.name}</td>
                      <td className="text-white">{v.email}</td>
                      <td className="text-white">{v.service_type || "-"}</td>
                      <td>
                        {v.status === "approved" && (
                          <span className="text-green-400 font-semibold">
                            Approved
                          </span>
                        )}
                        {v.status === "rejected" && (
                          <span className="text-red-400 font-semibold">
                            Rejected
                          </span>
                        )}
                        {v.status === "pending" && (
                          <span className="text-yellow-400 font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="flex gap-3 py-2">
                        {v.status === "pending" && (
                          <>
                            <button
                              onClick={() => approveVendor(v.id)}
                              className="px-3 py-2 bg-emerald-600 rounded-lg text-white flex gap-1"
                            >
                              <CheckCircle size={16} /> Approve
                            </button>
                            <button
                              onClick={() => rejectVendor(v.id)}
                              className="px-3 py-2 bg-red-600 rounded-lg text-white flex gap-1"
                            >
                              <XCircle size={16} /> Reject
                            </button>
                          </>
                        )}

                        {/* 🆕 DELETE BUTTON (ADDED, NOTHING REMOVED) */}
                        <button
                          onClick={() => deleteVendor(v.id)}
                          className="px-3 py-2 bg-gray-800 hover:bg-red-700 rounded-lg text-white flex gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ===== BUSINESS APPROVAL (UNCHANGED) ===== */}
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
                        <td className="py-3 text-white">{b.business_name}</td>
                        <td className="text-white">{b.Vendor?.name}</td>
                        <td className="text-white">{b.city}</td>
                        <td className="text-yellow-400 font-semibold">Pending</td>
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
          {/* ===== REVENUE VIEW ===== */}
{revenueView && (
  <>
    <h2 className="text-2xl font-bold mb-6 text-white">
      Platform Revenue
    </h2>

    <div className="bg-[#0F172A] p-6 rounded-xl mb-6">
      <p className="text-gray-400">Total Revenue</p>
      <h3 className="text-3xl font-bold text-green-400">
        ₹{totalRevenue}
      </h3>
    </div>

    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
          <th>Vendor ID</th>
          <th>Plan</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(p => (
          <tr key={p.id} className="border-b border-[#1F2937]">
            <td className="py-3 text-white">{p.vendor_id}</td>
            <td className="text-white">{p.plan}</td>
            <td className="text-green-400">₹{p.amount}</td>
            <td className="text-yellow-400">{p.payment_status}</td>
            <td className="text-gray-400">
              {new Date(p.createdAt).toLocaleDateString("en-IN")}
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
