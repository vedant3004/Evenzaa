const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const sequelize = require("./db")

// ================= MODELS =================
const User = require("./models/User")
const Vendor = require("./models/Vendor")
const VendorBusiness = require("./models/VendorBusiness")
const Booking = require("./models/Booking")
const Payment = require("./models/Payment")

// ================= ROUTES =================
const authRoutes = require("./routes/auth")
const vendorRoutes = require("./routes/vendor")
const bookingRoutes = require("./routes/booking") // ✅ MUST export router
const adminRoutes = require("./routes/admin")     // 🔥 ADD THIS

const app = express()

// ================= SECURITY =================
app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// ================= CORE =================
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
)

app.use(express.json({ limit: "10mb" }))

// ================= DATABASE RELATIONS =================

// User → Booking
User.hasMany(Booking, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
})
Booking.belongsTo(User, { foreignKey: "user_id" })

// Vendor → Booking
Vendor.hasMany(Booking, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
})
Booking.belongsTo(Vendor, { foreignKey: "vendor_id" })

// Booking → Payment
Booking.hasOne(Payment, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
})
Payment.belongsTo(Booking, { foreignKey: "booking_id" })

// 🔥 Vendor → VendorBusiness (MULTIPLE)
Vendor.hasMany(VendorBusiness, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
})
VendorBusiness.belongsTo(Vendor, {
  foreignKey: "vendor_id",
})

// ================= ROUTES =================
app.use("/api/auth", authRoutes)
app.use("/api/vendor", vendorRoutes)
app.use("/api/admin", adminRoutes) // 🔥🔥 THIS WAS MISSING

// 🔥🔥 SAFETY CHECK (IMPORTANT)
if (typeof bookingRoutes !== "function") {
  console.error("❌ bookingRoutes is NOT a router. Check routes/booking.js")
} else {
  app.use("/api/bookings", bookingRoutes)
}

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("EventZaa Backend Running 🚀")
})

// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL SERVER ERROR:", err)
  res.status(500).json({ message: "Internal Server Error" })
})

// ================= DB =================
sequelize
  .sync({
    alter: true,
    logging: console.log,
  })
  .then(() => console.log("✅ MySQL Connected & Tables Synced"))
  .catch((err) => console.error("❌ DB SYNC ERROR:", err))

// ================= START =================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
