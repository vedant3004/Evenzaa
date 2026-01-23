const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const sequelize = require("./db")

// ================= MODELS =================
const User = require("./models/User")
const Vendor = require("./models/Vendor")
const VendorBusiness = require("./models/VendorBusiness") // ✅ REQUIRED
const Booking = require("./models/Booking")
const Payment = require("./models/Payment")

// ================= ROUTES =================
const authRoutes = require("./routes/auth")
const vendorRoutes = require("./routes/vendor")

const app = express()

// ================= SECURITY MIDDLEWARE =================

// 🔐 Security headers
app.use(helmet())

// 🔒 Rate limiting (anti brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// ================= CORE MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // "https://eventzaa.com" // production
    ],
    credentials: true,
  })
)

// JSON body limit
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

// 🔥 Vendor → VendorBusiness (CRITICAL)
Vendor.hasOne(VendorBusiness, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
})
VendorBusiness.belongsTo(Vendor, {
  foreignKey: "vendor_id",
})

// ================= ROUTES =================
app.use("/api/auth", authRoutes)
app.use("/api/vendor", vendorRoutes)

// ================= HEALTH CHECK =================
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

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL SERVER ERROR:", err)
  res.status(500).json({
    message: "Internal Server Error",
  })
})

// ================= DB SYNC =================
sequelize
  .sync({
    alter: true, // ⚠️ dev only, prod → migrations
    logging: console.log, // 🔥 SHOW SQL ERRORS (IMPORTANT)
  })
  .then(() => {
    console.log("✅ MySQL Connected & Tables Synced")
  })
  .catch((err) => {
    console.error("❌ DB SYNC ERROR:", err)
  })

// ================= START SERVER =================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
