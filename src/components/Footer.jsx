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
          el.querySelectorAll(".reveal").forEach((e, i) => {
            e.style.animationDelay = `${i * 120}ms`
            e.classList.add("reveal-active")
          })
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
      className="bg-gradient-to-r from-[#020617] to-[#0f172a] text-gray-300 pt-20 opacity-0 translate-y-10 transition-all duration-[1200ms] ease-out"
    >
      <div className="max-w-7xl mx-auto px-6 grid gap-14 grid-cols-1 lg:grid-cols-4 pb-16">

        {/* ================= BRAND ================= */}
        <div className="flex gap-6 items-start text-left reveal">
          <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
            <div className="absolute inset-0 rounded-full bg-pink-500 blur-2xl opacity-60 animate-pulse" />
            <Image src="/logo/VY.png" fill className="relative z-10 object-contain" alt="EventZaa" />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-pink-400 mb-2 drop-shadow-[0_0_8px_#ec4899]">
              𝓔𝓿𝓮𝓷𝓩𝓪𝓪
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              EvenZaa helps you plan unforgettable events by connecting you with verified vendors,
              premium venues, and reliable services.
            </p>

            <div className="flex gap-4 mt-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <Icon
                  key={i}
                  size={18}
                  className="text-gray-400 hover:text-pink-400 hover:scale-110 transition cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= LINKS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:col-span-3">

          {[
            { title: "Quick Links", data: ["Home","About Us","Services","Portfolio","Contact"] },
            { title: "Our Services", data: ["Event Planning","Vendor Network","Venue Booking","Catering","Decoration"] },
            { title: "Portals", data: ["Admin Login"] },
            { title: "Contact Info", data: ["Navi Mumbai, Maharashtra","+91 9594332865","support@evenzaa.com"] }
          ].map((sec, i) => (
            <div key={i} className="footer-group reveal">
              <h3 className="footer-title">{sec.title}</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                {sec.data.map((t, idx) => (
                  <li key={idx} className="hover:text-pink-400 cursor-pointer transition">{t}</li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/10 bg-[#020617] py-6 text-gray-400 text-sm reveal">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} EvenZaa. All Rights Reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-pink-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-pink-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-pink-400 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-footer {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
        }

        .reveal-active {
          animation: revealUp 0.9s cubic-bezier(0.25,1,0.5,1) forwards;
        }

        @keyframes revealUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== VORTEX HOVER LINE ===== */
        .footer-title {
          position: relative;
          display: inline-block;
          color: #f472b6;
          font-weight: 600;
          margin-bottom: 1.25rem;
          letter-spacing: 0.04em;
          text-shadow: 0 0 12px rgba(236,72,153,0.8);
          cursor: pointer;
        }

        /* hidden by default */
        .footer-title::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          box-shadow: 0 0 12px #ec4899;
          transform: translateX(-50%);
          transition: width 0.45s ease;
        }

        /* animate only on hover */
        .footer-group:hover .footer-title::after {
          width: 100%;
        }
      `}</style>
    </footer>
  )
}
