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
  Shield,
  Star,
  Gem,
  CheckCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

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

  // ✅ NEW MEMBERSHIP STATE (ADDED ONLY)
  const [showGraph, setShowGraph] = useState(true)
const [salesData, setSalesData] = useState([])
  const [membershipOpen, setMembershipOpen] = useState(false)

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

  // BUSINESS (UNCHANGED)
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

  // BOOKINGS FETCH
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

  useEffect(() => {
  if (!bookings.length) return

  const now = new Date()

  const daySales = bookings
    .filter(b => {
      const d = new Date(b.createdAt)
      return d.toDateString() === now.toDateString()
    })
    .reduce((t,b)=>t+(b.amount||0),0)

  const monthSales = bookings
    .filter(b => {
      const d = new Date(b.createdAt)
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear()
    })
    .reduce((t,b)=>t+(b.amount||0),0)

  const yearSales = bookings
    .filter(b => {
      const d = new Date(b.createdAt)
      return d.getFullYear() === now.getFullYear()
    })
    .reduce((t,b)=>t+(b.amount||0),0)

  setSalesData([
    { name: "Today", sales: daySales },
    { name: "This Month", sales: monthSales },
    { name: "This Year", sales: yearSales },
  ])

}, [bookings])

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

        {/* ================= STATS PANEL ================= */}
        {activePanel === "stats" && (
          <>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">

  {/* TOTAL SALES */}
  <div className="group" onClick={() => setShowGraph(!showGraph)}>
    <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl 
      hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10
      transition-all duration-300 cursor-pointer h-full">

      <div className="flex items-start gap-4">
        <div className="bg-cyan-500/10 p-3 rounded-xl 
          group-hover:scale-110 transition duration-300">
          <Wallet className="text-cyan-400 w-6 h-6" />
        </div>

        <div className="flex-1">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            ₹{bookings.reduce((t,b)=>t+(b.amount||0),0)}
          </h3>
          <p className="text-gray-500 text-xs mt-2">
            Revenue generated from confirmed bookings.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* MEMBERSHIP CARD */}
  <div
    onClick={() => setMembershipOpen(!membershipOpen)}
    className="group"
  >
    <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl 
      hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/10
      transition-all duration-300 cursor-pointer h-full">

      <div className="flex items-start gap-4">
        <div className="bg-yellow-500/10 p-3 rounded-xl 
          group-hover:scale-110 transition duration-300">
          <Crown className="text-yellow-400 w-6 h-6" />
        </div>

        <div className="flex-1">
          <p className="text-gray-400 text-sm">Membership</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            Standard Plan
          </h3>
          <p className="text-gray-500 text-xs mt-2">
            Upgrade to Bronze, Silver or Gold for more leads & visibility.
          </p>
        </div>
      </div>
    </div>
  </div>
    </div>
            {/* ================= PROFESSIONAL MEMBERSHIP SECTION ================= */}
            {membershipOpen && (
              <div className="bg-[#111827] border border-[#1F2937] p-10 rounded-3xl mt-6">

                <h2 className="text-3xl font-bold text-white mb-10 text-center">
                  Choose Your Professional Plan
                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                  <MembershipCard
                    icon={<Shield className="text-cyan-400 w-8 h-8" />}
                    title="Bronze"
                    price="₹499 / month"
                    features={[
                      "Basic Listing",
                      "50 Leads / month",
                      "Email Support",
                      "Vendor Dashboard Access",
                    ]}
                  />

                  <MembershipCard
                    icon={<Star className="text-blue-400 w-8 h-8" />}
                    title="Silver"
                    price="₹999 / month"
                    features={[
                      "Featured Listing",
                      "200 Leads / month",
                      "Priority Support",
                      "Analytics Dashboard",
                      "Performance Insights",
                    ]}
                  />

                  <MembershipCard
                    icon={<Gem className="text-yellow-400 w-8 h-8" />}
                    title="Gold"
                    price="₹1999 / month"
                    features={[
                      "Top Placement",
                      "Unlimited Leads",
                      "Dedicated Account Manager",
                      "Premium Badge",
                      "24/7 Support",
                      "Advanced Analytics",
                    ]}
                  />

                </div>
              </div>

            )}
         {/* ================= SALES GRAPH SECTION ================= */}
{showGraph && (
  <div className="bg-[#111827] border border-[#1F2937] p-10 rounded-3xl mt-6
    shadow-2xl shadow-cyan-500/5">

    <h2 className="text-2xl font-bold text-white mb-8">
      Sales Analytics Overview
    </h2>

    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>

          <CartesianGrid stroke="#1F2937" strokeDasharray="4 4" />

          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            tick={{ fill: "#9CA3AF" }}
          />

          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF" }}
          />

          <Tooltip 
            contentStyle={{
              backgroundColor: "#0F172A",
              border: "1px solid #1F2937",
              borderRadius: "12px",
              color: "#fff"
            }}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#06B6D4"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>

  </div>
)}


          </>
        )}

        {/* ================= BUSINESS MODAL (RESTORED) ================= */}
{businessOpen && (
  <Modal title="Add / Update Business" onClose={() => allowBusinessOpen(false)}>
    <div className="grid md:grid-cols-2 gap-4">
      <Input
        label="Business Name"
        value={businessForm.business}
        onChange={v => setBusinessForm({ ...businessForm, business: v })}
      />
      <Input
        label="Service Type"
        value={businessForm.service_type}
        onChange={v => setBusinessForm({ ...businessForm, service_type: v })}
      />
      <Input
        label="Price"
        value={businessForm.price}
        onChange={v => setBusinessForm({ ...businessForm, price: v })}
      />
      <Input
        label="City"
        value={businessForm.city}
        onChange={v => setBusinessForm({ ...businessForm, city: v })}
      />
      <Input
        label="Phone"
        value={businessForm.phone}
        onChange={v => setBusinessForm({ ...businessForm, phone: v })}
      />
      <Input
        label="Image URL"
        value={businessForm.image}
        onChange={v => setBusinessForm({ ...businessForm, image: v })}
      />
    </div>

    <Input
      label="Services Provided"
      value={businessForm.services}
      onChange={v => setBusinessForm({ ...businessForm, services: v })}
    />

    <div>
      <label className="text-sm text-gray-400">Description</label>
      <textarea
        rows={4}
        value={businessForm.description}
        onChange={e =>
          setBusinessForm({ ...businessForm, description: e.target.value })
        }
        className="input mt-1 w-full resize-none"
      />
    </div>

    <button
      onClick={saveBusiness}
      disabled={saving}
      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
    >
      {saving ? "Saving..." : "Save Business"}
    </button>
  </Modal>
)}


        {/* ACCOUNT PANEL (NOT REMOVED 🔥) */}
        {activePanel === "account" && (
          
          <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>

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
              
          </div>
        )}

      </div>
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
  <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl flex gap-4 items-center cursor-pointer">
    {icon}
    <div>
      <p className="text-gray-400">{label}</p>
      <h3 className="text-xl font-bold text-white">{value}</h3>
    </div>
  </div>
)

const MembershipCard = ({ icon, title, price, features }) => (
  <div className="bg-[#0F172A] border border-[#1F2937] rounded-2xl p-8 text-center hover:scale-105 transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-cyan-400 text-lg font-semibold mb-6">{price}</p>
    <ul className="space-y-3 text-gray-400 text-sm text-left">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2">
          <CheckCircle className="text-green-400 w-4 h-4" />
          {f}
        </li>
      ))}
    </ul>
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
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
    <div className="bg-[#0F172A] w-full max-w-2xl rounded-2xl border border-[#1F2937]
      max-h-[85vh] flex flex-col">

      <div className="flex justify-between items-center px-6 py-4 border-b border-[#1F2937]">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button onClick={onClose}>
          <X className="text-gray-400" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-4 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
)
