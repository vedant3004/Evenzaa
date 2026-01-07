import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AuthPopup from "../components/AuthPopup"
import { AuthProvider } from "../context/AuthContext"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>

          {/* ✅ NAVBAR */}
          <Navbar />

          {/* ✅ MAIN CONTENT */}
          <main className="bg-gradient-to-b from-white via-pink-50 to-purple-50 min-h-screen">
            {children}
          </main>

          {/* ✅ AUTH POPUP (🔥 THIS WAS MISSING) */}
          <AuthPopup />

          {/* ✅ FOOTER */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  )
}
