"use client"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-footer")
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-r from-[#020617] to-[#0f172a] text-gray-300 pt-20 opacity-0 translate-y-10 transition-all duration-[1000ms] ease-out will-change-transform"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-16">

        {/* BRAND */}
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 group">
            <div className="absolute inset-0 rounded-full bg-pink-500 blur-3xl opacity-40 group-hover:opacity-70 transition animate-pulse"></div>
            <Image
              src="/logo/VY.png"
              fill
              className="relative z-10 object-contain hover:scale-110 transition"
              alt="EventZaa"
            />
          </div>

          <h2 className="text-2xl font-extrabold text-pink-400 mb-1 hover:text-pink-300 transition drop-shadow-[0_0_12px_#ec4899]">
            𝓔𝓿𝓮𝓷𝓩𝓪𝓪
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-4 text-center sm:text-left">
            EvenZaa helps you plan unforgettable events by connecting you with verified vendors,
            premium venues, and reliable services.
          </p>

          <div className="flex gap-4 justify-center sm:justify-start">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <Icon
                key={i}
                size={20}
                className="hover:text-pink-400 hover:scale-125 transition cursor-pointer drop-shadow-[0_0_6px_#ec4899]"
              />
            ))}
          </div>
        </div>

        {/* COLUMNS */}
        {["Company", "Services", "Portals", "Contact"].map((title, i) => (
          <div key={i} className="text-center sm:text-left group">
            <h3 className="text-pink-400 font-semibold mb-1 tracking-wide drop-shadow-[0_0_8px_#ec4899]">
              {title}
            </h3>
            <div className="w-10 h-[2px] bg-pink-400 mb-4 mx-auto sm:mx-0 group-hover:w-16 transition-all"></div>

            {title === "Company" && (
              <ul className="space-y-3 text-sm">
                {["About Us", "Careers", "Blog", "Contact Us"].map((t, i) => (
                  <li key={i} className="hover:text-pink-400 transition cursor-pointer">{t}</li>
                ))}
              </ul>
            )}

            {title === "Services" && (
              <ul className="space-y-3 text-sm">
                {["Event Planning", "Vendor Network", "Venue Booking", "Catering", "Decoration"].map((t, i) => (
                  <li key={i} className="hover:text-pink-400 transition cursor-pointer">{t}</li>
                ))}
              </ul>
            )}

            {title === "Portals" && (
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/admin/login" className="hover:text-pink-400 transition">Admin Login</a>
                </li>
              </ul>
            )}

            {title === "Contact" && (
              <ul className="space-y-4 text-sm">
                <li className="flex justify-center sm:justify-start gap-3 items-start hover:text-pink-400 transition">
                  <MapPin size={18} className="text-pink-400 mt-1" />
                  Navi Mumbai, Maharashtra, India
                </li>
                <li className="flex justify-center sm:justify-start gap-3 items-center hover:text-pink-400 transition">
                  <Phone size={18} className="text-pink-400" /> +91 9594332865
                </li>
                <li className="flex justify-center sm:justify-start gap-3 items-center hover:text-pink-400 transition">
                  <Mail size={18} className="text-pink-400" /> support@evenzaa.com
                </li>
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* TRUST STRIP */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-gray-400">
          <span>✔ 5000+ Verified Vendors</span>
          <span>✔ Trusted by 10,000+ Customers</span>
          <span>✔ Secure Booking</span>
          <span>✔ 24/7 Support</span>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EvenZaa • Made with ❤️ in India
      </div>

      <style jsx>{`
        .animate-footer {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </footer>
  )
}
