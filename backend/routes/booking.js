const express = require("express")
const router = express.Router()

const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")

// 🔐 AUTH MIDDLEWARE (SAFE ADD)
const {
  verifyToken,
  isVendor,
} = require("../middleware/authMiddleware")

// ================= GET VENDOR FOR BOOKING =================
// GET /api/bookings/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params

    const vendor = await VendorBusiness.findOne({
      where: { slug, approved: true },
    })

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    res.json(vendor)
  } catch (err) {
    console.error("❌ BOOKING FETCH ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// ================= CREATE BOOKING =================
// POST /api/bookings/create
router.post("/create", async (req, res) => {
  try {
    const {
      vendor_business_id,
      vendor_id,
      user_id,
      customer_name,
      customer_phone,
      customer_address,
      date,
      time,
      amount,
    } = req.body

    if (!vendor_business_id || !vendor_id || !date) {
      return res.status(400).json({ message: "Required fields missing" })
    }

    const booking = await Booking.create({
      vendor_business_id,
      vendor_id,
      user_id: user_id || null,

      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      customer_address: customer_address || null,

      date,
      time,
      amount,
      status: "pending",
    })

    res.status(201).json({
      success: true,
      message: "✅ Booking placed successfully",
      booking,
    })
  } catch (err) {
    console.error("❌ BOOKING CREATE ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// =====================================================
// 🔥 VENDOR: GET MY BOOKINGS (NEW - SAFE ADD)
// GET /api/bookings/vendor
// =====================================================
router.get(
  "/vendor",
  verifyToken,
  isVendor,
  async (req, res) => {
    try {
      const vendorId = req.user.id

      const bookings = await Booking.findAll({
        where: { vendor_id: vendorId },
        order: [["createdAt", "DESC"]],
      })

      res.json(bookings)
    } catch (err) {
      console.error("❌ VENDOR BOOKINGS ERROR:", err)
      res.status(500).json({ message: "Server error" })
    }
  }
)

module.exports = router
