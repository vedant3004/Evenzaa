const express = require("express")
const router = express.Router()

const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")

const {
  verifyToken,
  isVendor,
} = require("../middleware/authMiddleware")

// =====================================================
// 🔥 VENDOR: GET MY BOOKINGS (PUT THIS FIRST)
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

// =====================================================
// 🔥 VENDOR: GET MY BOOKINGS (ALIAS)
// GET /api/bookings/vendor/all
// =====================================================
router.get(
  "/vendor/all",
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
      console.error("❌ VENDOR BOOKINGS ERROR (ALL):", err)
      res.status(500).json({ message: "Server error" })
    }
  }
)

// ================= GET VENDOR FOR BOOKING =================
// ⚠️ KEEP THIS AT LAST
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

module.exports = router
