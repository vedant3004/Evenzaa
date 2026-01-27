"use client"

import { useEffect, useState } from "react"
import { BarChart3, Wallet, Crown, X, LogOut, Store, UserCog } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"

export default function VendorDash() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  const [businessOpen, allowBusinessOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

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
    if (user === undefined) return

    if (user && user.role === "vendor") {
      setVendor(user)
      setBusinessForm({
        business: user.name || "",
        service_type: user.service_type || "",
        price: user.price || "",
        city: user.city || "",
        phone: user.phone || "",
        image: user.image || "",
        services: Array.isArray(user.services)
          ? user.services.join(", ")
          : "",
        description: user.description || "",
      })
    }

    setLoading(false)
  }, [user])

  const logoutVendor = () => {
    logout()
    router.push("/vendor/login")
  }

  const saveBusiness = async () => {
    if (!businessForm.business || !businessForm.city || !businessForm.service_type) {
      alert("Business name, city and service type required")
      return
    }

    const token = localStorage.getItem("evenzaa_token")

    if (!token) {
      alert("Session expired. Please login again.")
      logoutVendor()
      return
    }

    try {
      setSaving(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/business`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business: businessForm.business,
            service_type: businessForm.service_type,
            price: Number(businessForm.price || 0),
            city: businessForm.city,
            phone: businessForm.phone,
            image: businessForm.image,
            services: businessForm.services
              ? businessForm.services.split(",").map(s => s.trim())
              : [],
            description: businessForm.description,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Failed to save business")
        return
      }

      setSuccessMsg("✅ Business saved successfully! Pending admin approval.")
      setTimeout(() => setSuccessMsg(""), 3000)
      allowBusinessOpen(false)
    } catch (err) {
      alert("Server error while saving business")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="pt-32 text-center text-gray-400">Loading dashboard...</div>
  }

  if (!vendor) {
    return <div className="pt-32 text-center text-xl text-gray-300">Vendor login required</div>
  }

  return (
    <div className="pt-32 min-h-screen bg-[#0B1120] px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome, {vendor.name}
          </h1>
          <button
            onClick={logoutVendor}
            className="flex gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-900/40 text-emerald-400 rounded-xl font-semibold border border-emerald-700">
            {successMsg}
          </div>
        )}

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Stat icon={<Wallet className="text-cyan-400" />} label="Total Sales" value={`₹${vendor.sales || 0}`} />
          <Stat icon={<Crown className="text-yellow-400" />} label="Membership" value={vendor.plan || "Standard"} />
          <Stat icon={<BarChart3 className="text-purple-400" />} label="Performance" value="Excellent" />
        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-3 gap-8">
          <ActionCard
            icon={<Store className="text-cyan-400" />}
            title="Add / Update Business Listing"
            desc="This listing will be visible to customers"
            action={() => allowBusinessOpen(true)}
          />

          <ActionCard
            icon={<UserCog className="text-purple-400" />}
            title="Account Settings"
            desc="Manage your account"
            link="/vendor/dashboard/account"
          />

          <ActionCard
            title="Bookings & Leads"
            desc="View customer bookings"
            link="/vendor/dashboard/bookings"
          />
        </div>
      </div>

      {businessOpen && (
        <Modal
          title="Add / Update Business Listing"
          onClose={() => allowBusinessOpen(false)}
          footer={
            <button
              onClick={saveBusiness}
              disabled={saving}
              className="w-full btn-primary"
            >
              {saving ? "Saving..." : "Save Business"}
            </button>
          }
        >
          <Input label="Business Name" value={businessForm.business}
            onChange={v => setBusinessForm({ ...businessForm, business: v })} />
          <Input label="Service Type" value={businessForm.service_type}
            onChange={v => setBusinessForm({ ...businessForm, service_type: v })} />
          <Input label="Starting Price" value={businessForm.price}
            onChange={v => setBusinessForm({ ...businessForm, price: v })} />
          <Input label="City" value={businessForm.city}
            onChange={v => setBusinessForm({ ...businessForm, city: v })} />
          <Input label="Phone" value={businessForm.phone}
            onChange={v => setBusinessForm({ ...businessForm, phone: v })} />
          <Input label="Image URL" value={businessForm.image}
            onChange={v => setBusinessForm({ ...businessForm, image: v })} />

          <textarea className="input" rows={2} placeholder="Services (comma separated)"
            value={businessForm.services}
            onChange={e => setBusinessForm({ ...businessForm, services: e.target.value })} />

          <textarea className="input" rows={3} placeholder="Business Description"
            value={businessForm.description}
            onChange={e => setBusinessForm({ ...businessForm, description: e.target.value })} />
        </Modal>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow flex gap-4 items-center">
    {icon}
    <div>
      <p className="text-gray-400">{label}</p>
      <h3 className="font-bold text-xl text-white">{value}</h3>
    </div>
  </div>
)

const ActionCard = ({ icon, title, desc, action, link }) => (
  <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-2xl shadow-xl">
    {icon}
    <h3 className="font-bold text-xl mt-4 text-white">{title}</h3>
    <p className="text-gray-400 mb-4">{desc}</p>
    {action ? (
      <button onClick={action} className="btn-primary w-full">Open</button>
    ) : (
      <a href={link} className="btn-primary block text-center">View</a>
    )}
  </div>
)

const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
    <div className="bg-[#0F172A] w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-[#1F2937]">
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#1F2937]">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
      </div>

      <div className="px-6 py-4 overflow-y-auto space-y-4">
        {children}
      </div>

      <div className="px-6 py-4 border-t border-[#1F2937] bg-[#0F172A]">
        {footer}
      </div>
    </div>
  </div>
)

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      className="input mt-1"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)
