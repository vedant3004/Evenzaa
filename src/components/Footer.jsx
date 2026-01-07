import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#020617] to-[#0f172a] text-gray-300 pt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-16">

        {/* BRAND */}
        <div className="text-center sm:text-left">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 mx-auto sm:mx-0">
            <div className="absolute inset-0 rounded-full bg-pink-500 blur-3xl opacity-40"></div>
            <Image src="/logo/VY.png" fill className="relative z-10 object-contain" alt="EventZaa" />
          </div>

          <h2 className="text-2xl font-extrabold text-pink-400 mb-2">𝓔𝓿𝓮𝓷𝓩𝓪𝓪</h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            EvenZaa helps you plan unforgettable events by connecting you with verified vendors, premium venues, and reliable services.
          </p>

          <div className="flex justify-center sm:justify-start gap-4">
            <a className="hover:text-pink-400"><Facebook size={20} /></a>
            <a className="hover:text-pink-400"><Instagram size={20} /></a>
            <a className="hover:text-pink-400"><Twitter size={20} /></a>
            <a className="hover:text-pink-400"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* COMPANY */}
        <div className="text-center sm:text-left">
          <h3 className="text-pink-400 font-semibold mb-1 tracking-wide">Company</h3>
          <div className="w-10 h-[2px] bg-pink-400 mb-4 mx-auto sm:mx-0"></div>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-pink-400">About Us</li>
            <li className="hover:text-pink-400">Careers</li>
            <li className="hover:text-pink-400">Blog</li>
            <li className="hover:text-pink-400">Contact Us</li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="text-center sm:text-left">
          <h3 className="text-pink-400 font-semibold mb-1 tracking-wide">Services</h3>
          <div className="w-10 h-[2px] bg-pink-400 mb-4 mx-auto sm:mx-0"></div>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-pink-400">Event Planning</li>
            <li className="hover:text-pink-400">Vendor Network</li>
            <li className="hover:text-pink-400">Venue Booking</li>
            <li className="hover:text-pink-400">Catering</li>
            <li className="hover:text-pink-400">Decoration</li>
          </ul>
        </div>

        {/* PORTALS */}
        <div className="text-center sm:text-left">
          <h3 className="text-pink-400 font-semibold mb-1 tracking-wide">Portals</h3>
          <div className="w-10 h-[2px] bg-pink-400 mb-4 mx-auto sm:mx-0"></div>
          <ul className="space-y-3 text-sm">
            <li><a href="/admin/login" className="hover:text-pink-400">Admin Login</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="text-center sm:text-left">
          <h3 className="text-pink-400 font-semibold mb-1 tracking-wide">Contact</h3>
          <div className="w-10 h-[2px] bg-pink-400 mb-4 mx-auto sm:mx-0"></div>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-center sm:justify-start gap-3 items-start">
              <MapPin size={18} className="text-pink-400 mt-1" /> Navi Mumbai, Maharashtra, India
            </li>
            <li className="flex justify-center sm:justify-start gap-3 items-center">
              <Phone size={18} className="text-pink-400" /> +91 9594332865
            </li>
            <li className="flex justify-center sm:justify-start gap-3 items-center">
              <Mail size={18} className="text-pink-400" /> support@evenzaa.com
            </li>
          </ul>
        </div>
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
    </footer>
  )
}
