import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AuthProvider } from "../context/AuthContext"

export default function RootLayout({ children }) {
return (
<html lang="en">
<body className="bg-gray-50 text-gray-900">
<AuthProvider>
<Navbar />
<main className="bg-gradient-to-b from-white via-pink-50 to-purple-50">
{children}
</main>
<Footer />
</AuthProvider>
</body>
</html>
)
}
