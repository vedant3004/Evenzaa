"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Wallet,
  Crown,
  X,
  Store,
  UserCog,
  ClipboardList,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function VendorDash() {
  const router = useRouter()
  const { user } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  const [businessOpen, allowBusinessOpen] = useState(false)
  const [activePanel, setActivePanel] = useState("stats")
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // 🔥 NEW: BOOKINGS STATE
  const [bookings, setBookings] = useState([])
  const [bookingLoading, setBookingLoading] = useState(false)

  const [businessForm, setBusinessForm] = useState({
    business: "",
    service_type: "",
    price: "",
    city: "",
    phone: "",
    image: "",
    services: "",
    description: "",
  })

  // ================= LOAD VENDOR =================
  useEffect(() => {
    if (!user) return
    setVendor(user)
    setLoading(false)
  }, [user])

  // ================= 🔥 FETCH BOOKINGS =================
  useEffect(() => {
    if (!user || user.role !== "vendor") return

    const fetchBookings = async () => {
      try {
        setBookingLoading(true)
        const token = localStorage.getItem("evenzaa_token")

        const res = await fetch(`${API_BASE}/api/bookings/vendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (Array.isArray(data)) {
          setBookings(data)
        }
      } catch (err) {
        console.error("❌ Vendor booking fetch failed:", err)
      } finally {
        setBookingLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const saveBusiness = async () => {
    const token = localStorage.getItem("evenzaa_token")
    if (!token) return

    try {
      setSaving(true)

      await fetch(`${API_BASE}/api/vendor/business`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(businessForm),
      })

      setSuccessMsg("✅ Business saved successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
      allowBusinessOpen(false)
    } catch {
      alert("Error saving business")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="pt-28 min-h-screen bg-[#0B1120] px-4 relative">

      {/* ================= FLOATING ICON BAR ================= */}
      <div className="fixed top-20 right-6 z-40 flex gap-3
                      bg-[#020617]/80 backdrop-blur-md
                      border border-[#1F2937]
                      px-4 py-2 rounded-full shadow-xl animate-fadeUp">
        <IconBtn label="Stats" onClick={() => setActivePanel("stats")}>
          <BarChart3 />
        </IconBtn>

        <IconBtn label="Business" onClick={() => allowBusinessOpen(true)}>
          <Store />
        </IconBtn>

        <IconBtn label="Account" onClick={() => setActivePanel("account")}>
          <UserCog />
        </IconBtn>

        <IconBtn label="Bookings" onClick={() => setActivePanel("bookings")}>
          <ClipboardList />
        </IconBtn>
      </div>

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-extrabold text-white mb-10">
          Welcome, {vendor?.name}
        </h1>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-900/40 text-emerald-400
                          rounded-xl border border-emerald-700">
            {successMsg}
          </div>
        )}

        {/* ================= STATS ================= */}
        {activePanel === "stats" && (
          <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fadeUp">
            <Stat icon={<Wallet className="text-cyan-400" />} label="Total Sales" value={`₹${bookings.reduce((t,b)=>t+(b.amount||0),0)}`} />
            <Stat icon={<Crown className="text-yellow-400" />} label="Membership" value="Standard" />
            <Stat icon={<BarChart3 className="text-purple-400" />} label="Performance" value="Active" />
          </div>
        )}

        {/* ================= BOOKINGS ================= */}
        {activePanel === "bookings" && (
          <div className="bg-[#111827] border border-[#1F2937]
                          p-8 rounded-2xl animate-fadeUp">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bookings & Leads
            </h2>

            {bookingLoading && (
              <p className="text-gray-400">Loading bookings...</p>
            )}

            {!bookingLoading && bookings.length === 0 && (
              <p className="text-gray-400">No bookings yet.</p>
            )}

            {!bookingLoading && bookings.length > 0 && (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div
                    key={b.id}
                    className="border border-[#1F2937]
                               rounded-xl p-4 bg-[#0F172A]"
                  >
                    <p className="text-white font-semibold">
                      {b.customer_name} – ₹{b.amount}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {b.service} | {b.customer_phone}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Status: {b.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ACCOUNT ================= */}
        {activePanel === "account" && (
          <div className="bg-[#111827] border border-[#1F2937]
                          p-8 rounded-2xl animate-fadeUp">
            <h2 className="text-2xl font-bold text-white mb-3">
              Account Settings
            </h2>
            <p className="text-gray-400">
              Managed by admin for non-technical vendors.
            </p>
          </div>
        )}
      </div>

      {/* ================= BUSINESS MODAL ================= */}
      {businessOpen && (
        <Modal title="Add / Update Business" onClose={() => allowBusinessOpen(false)}>
          <Input label="Business Name" onChange={v => setBusinessForm({ ...businessForm, business: v })} />
          <Input label="Service Type" onChange={v => setBusinessForm({ ...businessForm, service_type: v })} />
          <Input label="City" onChange={v => setBusinessForm({ ...businessForm, city: v })} />
          <Input label="Phone" onChange={v => setBusinessForm({ ...businessForm, phone: v })} />

          <button
            onClick={saveBusiness}
            className="btn-primary w-full mt-4"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Business"}
          </button>
        </Modal>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const IconBtn = ({ children, label, onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-10 h-10 rounded-full
               bg-[#111827] border border-[#1F2937]
               text-blue-400 flex items-center justify-center
               hover:bg-blue-600 hover:text-white transition"
  >
    {children}
    <span className="absolute -bottom-8 text-xs px-2 py-1 rounded
                     bg-black text-white opacity-0
                     group-hover:opacity-100 transition whitespace-nowrap">
      {label}
    </span>
  </button>
)

const Stat = ({ icon, label, value }) => (
  <div className="bg-[#111827] border border-[#1F2937]
                  p-6 rounded-xl flex gap-4 items-center">
    {icon}
    <div>
      <p className="text-gray-400">{label}</p>
      <h3 className="text-xl font-bold text-white">{value}</h3>
    </div>
  </div>
)

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50
                  flex items-center justify-center px-4">
    <div className="bg-[#0F172A] w-full max-w-xl
                    rounded-2xl border border-[#1F2937]">
      <div className="flex justify-between items-center
                      px-6 py-4 border-b border-[#1F2937]">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button onClick={onClose}>
          <X className="text-gray-400" />
        </button>
      </div>
      <div className="px-6 py-4 space-y-4">{children}</div>
    </div>
  </div>
)

const Input = ({ label, onChange }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input className="input mt-1" onChange={e => onChange(e.target.value)} />
  </div>
)
