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

  // ================= BUSINESS FORM =================
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

  // ================= LOAD USER =================
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

  // ================= SAVE BUSINESS =================
  const saveBusiness = async () => {
    if (!businessForm.business || !businessForm.city || !businessForm.service_type) {
      alert("Business name, city and service type required")
      return
    }

    // ✅ FIX: CORRECT TOKEN KEY
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
      console.error("SAVE BUSINESS ERROR:", err)
      alert("Server error while saving business")
    } finally {
      setSaving(false)
    }
  }

  // ================= UI STATES =================
  if (loading) {
    return <div className="pt-32 text-center text-gray-500">Loading dashboard...</div>
  }

  if (!vendor) {
    return <div className="pt-32 text-center text-xl">Vendor login required</div>
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-extrabold">
            Welcome, {vendor.name}
          </h1>
          <button onClick={logoutVendor} className="btn-danger flex gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Stat icon={<Wallet />} label="Total Sales" value={`₹${vendor.sales || 0}`} />
          <Stat icon={<Crown />} label="Membership" value={vendor.plan || "Standard"} />
          <Stat icon={<BarChart3 />} label="Performance" value="Excellent" />
        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-3 gap-8">
          <ActionCard
            icon={<Store />}
            title="Add / Update Business Listing"
            desc="This listing will be visible to customers"
            action={() => allowBusinessOpen(true)}
          />

          <ActionCard
            icon={<UserCog />}
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

      {/* ================= BUSINESS MODAL ================= */}
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

          <textarea
            className="input"
            rows={2}
            placeholder="Services (comma separated)"
            value={businessForm.services}
            onChange={e => setBusinessForm({ ...businessForm, services: e.target.value })}
          />

          <textarea
            className="input"
            rows={3}
            placeholder="Business Description"
            value={businessForm.description}
            onChange={e => setBusinessForm({ ...businessForm, description: e.target.value })}
          />
        </Modal>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow flex gap-4 items-center">
    {icon}
    <div>
      <p className="text-gray-500">{label}</p>
      <h3 className="font-bold text-xl">{value}</h3>
    </div>
  </div>
)

const ActionCard = ({ icon, title, desc, action, link }) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl">
    {icon}
    <h3 className="font-bold text-xl mt-4">{title}</h3>
    <p className="text-gray-500 mb-4">{desc}</p>
    {action ? (
      <button onClick={action} className="btn-primary w-full">Open</button>
    ) : (
      <a href={link} className="btn-primary block text-center">View</a>
    )}
  </div>
)

const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose}><X /></button>
      </div>

      <div className="px-6 py-4 overflow-y-auto space-y-4">
        {children}
      </div>

      <div className="px-6 py-4 border-t bg-white">
        {footer}
      </div>
    </div>
  </div>
)

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <input
      className="input mt-1"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)
