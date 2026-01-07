"use client"
import { getVendors } from "../../../utils/vendorDB"
import { getUsers } from "../../../utils/userDB"
import { Users, Wallet, Crown, BarChart3, Store } from "lucide-react"
import { useState } from "react"

export default function AdminDash() {
  const vendors = getVendors()
  const users = getUsers()
  const [view, setView] = useState("vendors") // vendors | users

  const totalSales = vendors.reduce((sum, v) => sum + (v.sales || 0), 0)

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-10">Admin Dashboard</h1>

        {/* TOP STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div onClick={() => setView("vendors")}
               className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition">
            <Store className="text-pink-600" size={32} />
            <div>
              <p className="text-gray-500">Total Vendors</p>
              <h2 className="text-2xl font-bold">{vendors.length}</h2>
            </div>
          </div>

          <div onClick={() => setView("users")}
               className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition">
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

        {/* CONDITIONAL LIST */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl">

          {view === "vendors" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Registered Vendors</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3">Business</th>
                    <th className="pb-3">Username</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-semibold">{v.business}</td>
                      <td className="py-3">{v.username}</td>
                      <td className="py-3">{v.plan}</td>
                      <td className="py-3 text-green-600 font-semibold">₹{v.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

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
