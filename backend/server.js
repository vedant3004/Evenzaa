const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const app = express()

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
const adminRoutes = require("./routes/admin")   
const reviewRoutes = require("./routes/review")  // 🔥 ADD THIS




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
// 🔥 Vendor → Payment
Vendor.hasMany(Payment, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
})
Payment.belongsTo(Vendor, {
  foreignKey: "vendor_id",
})

// 🔥 VendorBusiness → Payment
// 🔥 Vendor → VendorBusiness (MULTIPLE)
Vendor.hasMany(VendorBusiness, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
})
VendorBusiness.belongsTo(Vendor, {
  foreignKey: "vendor_id",
})
VendorBusiness.belongsTo(Vendor, {
  foreignKey: "vendor_id",
})

VendorBusiness.hasMany(Payment, {
  foreignKey: "business_id",
  onDelete: "CASCADE",
})
Payment.belongsTo(VendorBusiness, {
  foreignKey: "business_id",
})




// ================= ROUTES =================
app.use("/api/auth", authRoutes)
app.use("/api/vendor", vendorRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/reviews", reviewRoutes)

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

// ================= DB (SAFE MODE – UPDATED) =================
;(async () => {
  try {
    // ✅ ONLY AUTHENTICATE (SAFE FOR PRODUCTION)
    await sequelize.authenticate()
    console.log("✅ MySQL connection authenticated")

    /**
     * ❌ DANGEROUS IN EXISTING DB
     * Keeping this commented for safety.
     * Use ONLY when you intentionally change schema.
     */
    
    await sequelize.sync({
      alter: true,
      logging: console.log,
    })
    console.log("✅ MySQL Connected & Tables Synced")
    

  } catch (err) {
    console.error("❌ DB CONNECTION ERROR:", err)
  }
})()

// ================= START =================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
