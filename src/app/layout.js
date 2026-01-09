import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AuthPopup from "../components/AuthPopup"
import { AuthProvider } from "../context/AuthContext"
import { AnimatePresence } from "framer-motion"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 overflow-x-hidden">

        <AuthProvider>

          {/* NAVBAR */}
          <Navbar />

          {/* 🔥 PAGE TRANSITION WRAPPER */}
          <AnimatePresence mode="wait">
            <main className="bg-gradient-to-b from-white via-pink-50 to-purple-50 min-h-screen">
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
