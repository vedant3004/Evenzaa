import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AuthPopup from "../components/AuthPopup"
import { AuthProvider } from "../context/AuthContext"
import { AnimatePresence } from "framer-motion"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0B1120] text-white overflow-x-hidden">

        <AuthProvider>

          {/* NAVBAR */}
          <Navbar />

          {/* 🔥 PAGE TRANSITION WRAPPER */}
          <AnimatePresence mode="wait">
            <main className="bg-gradient-to-b from-[#0B1120] via-[#111827] to-[#0B1120] min-h-screen">
              {children}
            </main>
          </AnimatePresence>

          {/* AUTH POPUP */}
          <AuthPopup />

          {/* FOOTER */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  )
}
