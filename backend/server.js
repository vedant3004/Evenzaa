const express = require("express")
const cors = require("cors")
require("dotenv").config()

const sequelize = require("./db")

// ================= MODELS =================
const User = require("./models/User")
const Vendor = require("./models/Vendor")
const Booking = require("./models/Booking")
const Payment = require("./models/Payment")

// ================= ROUTES =================
const authRoutes = require("./routes/auth")
const vendorRoutes = require("./routes/vendor") // ✅ Vendor routes added

const app = express()

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:3000", // Next.js frontend
  credentials: true,
}))
app.use(express.json())

// ================= RELATIONS =================

// User → Booking
User.hasMany(Booking, { foreignKey: "user_id" })
Booking.belongsTo(User, { foreignKey: "user_id" })

// Vendor → Booking
Vendor.hasMany(Booking, { foreignKey: "vendor_id" })
Booking.belongsTo(Vendor, { foreignKey: "vendor_id" })

// Booking → Payment
Booking.hasOne(Payment, { foreignKey: "booking_id" })
Payment.belongsTo(Booking, { foreignKey: "booking_id" })

// ================= ROUTES =================
app.use("/api/auth", authRoutes)
app.use("/api/vendor", vendorRoutes) // ✅ Vendor APIs live

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("EventZaa Backend Running 🚀")
})

// ================= DB SYNC =================
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ MySQL Connected & Tables Synced")
  })
  .catch((err) => {
    console.error("❌ DB Error:", err)
  })

// ================= START SERVER =================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
