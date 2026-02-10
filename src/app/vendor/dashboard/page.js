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

  // BOOKINGS
  const [bookings, setBookings] = useState([])
  const [bookingLoading, setBookingLoading] = useState(false)

  // ACCOUNT
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    password: "",
  })
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountMsg, setAccountMsg] = useState("")

  // BUSINESS (FULL – SAME DATA)
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

  useEffect(() => {
    if (!user) return
    setVendor(user)

    setAccountForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      image: user.image || "",
      password: "",
    })

    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user || user.role !== "vendor") return

    const fetchBookings = async () => {
      try {
        setBookingLoading(true)
        const token = localStorage.getItem("evenzaa_token")
        const res = await fetch(`${API_BASE}/api/bookings/vendor`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (Array.isArray(data)) setBookings(data)
      } catch (err) {
        console.error(err)
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

  const saveAccountSettings = async () => {
    const token = localStorage.getItem("evenzaa_token")
    if (!token) return
    try {
      setAccountSaving(true)
      setAccountMsg("")
      await fetch(`${API_BASE}/api/vendor/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountForm),
      })
      setAccountMsg("✅ Account updated successfully")
      setAccountForm({ ...accountForm, password: "" })
    } catch {
      setAccountMsg("❌ Failed to update account")
    } finally {
      setAccountSaving(false)
    }
  }

  if (loading) {
    return <div className="pt-32 text-center text-gray-400">Loading dashboard...</div>
  }

  return (
    <div className="pt-28 min-h-screen bg-[#0B1120] px-4 relative">

      {/* FLOATING BAR */}
      <div className="fixed top-20 right-6 z-40 flex gap-3 bg-[#020617]/80 backdrop-blur-md
        border border-[#1F2937] px-4 py-2 rounded-full shadow-xl">
        <IconBtn label="Stats" onClick={() => setActivePanel("stats")}><BarChart3 /></IconBtn>
        <IconBtn label="Business" onClick={() => allowBusinessOpen(true)}><Store /></IconBtn>
        <IconBtn label="Account" onClick={() => setActivePanel("account")}><UserCog /></IconBtn>
        <IconBtn label="Bookings" onClick={() => setActivePanel("bookings")}><ClipboardList /></IconBtn>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10">
          Welcome, {vendor?.name}
        </h1>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-900/40 text-emerald-400 rounded-xl border border-emerald-700">
            {successMsg}
          </div>
        )}

        {activePanel === "stats" && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Stat icon={<Wallet className="text-cyan-400" />} label="Total Sales"
              value={`₹${bookings.reduce((t,b)=>t+(b.amount||0),0)}`} />
            <Stat icon={<Crown className="text-yellow-400" />} label="Membership" value="Standard" />
            <Stat icon={<BarChart3 className="text-purple-400" />} label="Performance" value="Active" />
          </div>
        )}

        {activePanel === "bookings" && (
          <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Bookings & Leads</h2>
            {bookingLoading && <p className="text-gray-400">Loading bookings...</p>}
            {!bookingLoading && bookings.map(b => (
              <div key={b.id} className="border border-[#1F2937] rounded-xl p-4 bg-[#0F172A] mb-3">
                <p className="text-white font-semibold">{b.customer_name} – ₹{b.amount}</p>
                <p className="text-gray-400 text-sm">{b.service} | {b.customer_phone}</p>
                <p className="text-gray-500 text-xs">Status: {b.status}</p>
              </div>
            ))}
          </div>
        )}

        {activePanel === "account" && (
          <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>

            {accountMsg && (
              <div className="mb-4 p-3 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-700">
                {accountMsg}
              </div>
            )}

            <Input label="Full Name" value={accountForm.name}
              onChange={v => setAccountForm({ ...accountForm, name: v })} />
            <Input label="Email (Read only)" value={accountForm.email} disabled />
            <Input label="Phone" value={accountForm.phone}
              onChange={v => setAccountForm({ ...accountForm, phone: v })} />
            <Input label="Profile Image URL" value={accountForm.image}
              onChange={v => setAccountForm({ ...accountForm, image: v })} />
            <Input label="Change Password" type="password"
              value={accountForm.password}
              onChange={v => setAccountForm({ ...accountForm, password: v })} />

            <button onClick={saveAccountSettings} disabled={accountSaving}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              {accountSaving ? "Saving..." : "Save Account Changes"}
            </button>
          </div>
        )}
      </div>

      {/* ================= BUSINESS MODAL (FIXED & PROFESSIONAL) ================= */}
      {businessOpen && (
        <Modal title="Add / Update Business" onClose={() => allowBusinessOpen(false)}>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Business Name" onChange={v => setBusinessForm({ ...businessForm, business: v })} />
            <Input label="Service Type" onChange={v => setBusinessForm({ ...businessForm, service_type: v })} />
            <Input label="Price" onChange={v => setBusinessForm({ ...businessForm, price: v })} />
            <Input label="City" onChange={v => setBusinessForm({ ...businessForm, city: v })} />
            <Input label="Phone" onChange={v => setBusinessForm({ ...businessForm, phone: v })} />
            <Input label="Image URL" onChange={v => setBusinessForm({ ...businessForm, image: v })} />
          </div>

          <Input label="Services Provided" onChange={v => setBusinessForm({ ...businessForm, services: v })} />

          <Textarea label="Description"
            onChange={v => setBusinessForm({ ...businessForm, description: v })} />

          <button onClick={saveBusiness} className="btn-primary w-full mt-6" disabled={saving}>
            {saving ? "Saving..." : "Save Business"}
          </button>
        </Modal>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const IconBtn = ({ children, label, onClick }) => (
  <button onClick={onClick}
    className="group relative w-10 h-10 rounded-full bg-[#111827]
    border border-[#1F2937] text-blue-400 flex items-center justify-center
    hover:bg-blue-600 hover:text-white transition">
    {children}
    <span className="absolute -bottom-8 text-xs px-2 py-1 rounded bg-black text-white
      opacity-0 group-hover:opacity-100">{label}</span>
  </button>
)

const Stat = ({ icon, label, value }) => (
  <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl flex gap-4 items-center">
    {icon}
    <div>
      <p className="text-gray-400">{label}</p>
      <h3 className="text-xl font-bold text-white">{value}</h3>
    </div>
  </div>
)

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
    <div className="bg-[#0F172A] w-full max-w-2xl rounded-2xl border border-[#1F2937]
      max-h-[85vh] flex flex-col">

      <div className="flex justify-between items-center px-6 py-4 border-b border-[#1F2937] sticky top-0 bg-[#0F172A] z-10">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button onClick={onClose}><X className="text-gray-400" /></button>
      </div>

      <div className="px-6 py-6 space-y-4 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
)

const Input = ({ label, value, onChange, disabled, type = "text" }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className="input mt-1 w-full"
    />
  </div>
)

const Textarea = ({ label, onChange }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <textarea
      rows={4}
      onChange={e => onChange(e.target.value)}
      className="input mt-1 w-full resize-none"
    />
  </div>
)
