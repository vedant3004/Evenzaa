"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export default function Footer() {

  const locations = [
    { name: "Mumbai", top: "22%", left: "18%", delay: "0s" },
    { name: "Delhi", top: "36%", left: "32%", delay: "0.4s" },
    { name: "Bangalore", top: "24%", left: "48%", delay: "0.8s" },
    { name: "Pune", top: "42%", left: "62%", delay: "1.2s" },
    { name: "Hyderabad", top: "56%", left: "50%", delay: "1.6s" },
  ]

  return (
    <footer className="bg-gradient-to-r from-[#0B1120] to-[#020617] text-[#9CA3AF] pt-20">

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-14">

        {/* ================= LEFT ================= */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo/VY.png" width={56} height={56} alt="EvenZaa" />
            <h2 className="text-3xl font-bold text-white">𝓔𝓿𝓮𝓷𝓩𝓪𝓪</h2>
          </div>

          <p className="text-base leading-7 max-w-sm mb-4">
            EvenZaa helps you plan unforgettable events by connecting you with
            verified vendors, premium venues, and reliable event solutions
            across India.
          </p>

          <p className="text-sm leading-6 max-w-sm mb-8 text-[#94A3B8]">
            From intimate celebrations to large-scale corporate events,
            we ensure seamless planning and flawless execution.
          </p>

          <h4 className="footer-heading">Contact Info</h4>

          <ul className="space-y-4 text-base">
            <li className="flex gap-3">
              <MapPin size={18} className="text-[#3B82F6]" />
              A/3, 2:12, Swagat CHS, Sector-24, Nerul (West),
              Navi Mumbai – 400706
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-[#3B82F6]" />
              +91 9594332865
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-[#3B82F6]" />
              support@evenzaa.com
            </li>
          </ul>
        </div>

        {/* ================= MIDDLE ================= */}
        <div className="flex gap-20 justify-end pr-6">

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-4 text-base">
              <li><Link className="footer-link" href="/">Home</Link></li>
              <li><Link className="footer-link" href="/about">About Us</Link></li>
              <li><Link className="footer-link" href="/services">Services</Link></li>
              <li><Link className="footer-link" href="/portfolio">Portfolio</Link></li>
              <li><Link className="footer-link" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Portals</h4>
            <ul className="space-y-4 text-base">
              <li>
                <Link className="footer-link" href="/admin/login">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex flex-col items-center">

          <h4
            className="footer-heading absolute"
            style={{ top: "0%", right: "16%" }}
          >
            Our Location
          </h4>

          <div className="relative h-28 max-w-[350px] w-full mt-19 mb-0">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="absolute group"
                style={{ top: loc.top, left: loc.left }}
              >
                <span
                  className="relative block w-3.5 h-3.5 rounded-full bg-[#3B82F6] animate-locationGlow"
                  style={{ animationDelay: loc.delay }}
                >
                  <span
                    className="absolute inset-0 rounded-full bg-[#3B82F6] blur-2xl opacity-60 animate-locationGlow"
                    style={{ animationDelay: loc.delay }}
                  />
                </span>

                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#020617] px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {loc.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <span
                key={i}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#3B82F6] transition"
              >
                <Icon size={18} className="text-white" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-white/10 py-6 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 EvenZaa. All Rights Reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-[#F59E0B] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        /* HEADINGS */
        .footer-heading {
          position: relative;
          display: inline-block;
          font-size: 1.125rem;
          font-weight: 600;
          color: white; /* DEFAULT WHITE */
          margin-bottom: 1.25rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .footer-heading:hover {
          color: #3B82F6; /* BLUE ON HOVER */
        }

        .footer-heading::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: #3B82F6; /* BLUE LINE */
          transform: translateX(-50%);
          transition: width 0.35s ease;
        }

        .footer-heading:hover::after {
          width: 100%;
        }

        /* LINKS UNDER HEADING */
        .footer-link {
          transition: color 0.25s ease;
        }

        .footer-link:hover {
          color: #F59E0B; /* GOLD */
        }

        /* LOCATION DOT GLOW */
        @keyframes locationGlow {
          0% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(2.2); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.35; }
        }

        .animate-locationGlow {
          animation: locationGlow 2.6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}
