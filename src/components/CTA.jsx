"use client"

import { useRouter } from "next/navigation"

export default function CTA() {
  const router = useRouter()

  // 🔹 Scroll to Home Top
  const handleGetStarted = () => {
    const homeSection = document.getElementById("home")
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "smooth" })
    } else {
      // fallback: go to home page
      router.push("/")
    }
  }

  // 🔹 Go to Vendors Listing Page
  const handleBrowseVendors = () => {
    router.push("/vendors")
  }

  return (
    <section className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] py-20 text-center text-white">
      <h2 className="text-3xl font-bold">
        Ready to Plan Your Perfect Event?
      </h2>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleGetStarted}
          className="bg-white text-[#2563EB] px-6 py-3 rounded-full font-semibold hover:bg-[#E5E7EB] transition"
        >
          Get Started
        </button>

        <button
          onClick={handleBrowseVendors}
          className="border border-white/40 px-6 py-3 rounded-full text-white hover:bg-white/10 transition"
        >
          Browse Vendors
        </button>
      </div>
    </section>
  )
}
