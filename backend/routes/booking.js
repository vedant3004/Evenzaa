const express = require("express")
const router = express.Router()

const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")

const {
  verifyToken,
  isVendor,
} = require("../middleware/authMiddleware")

// =====================================================
// ✅ USER: CREATE BOOKING
// POST /api/bookings
// =====================================================
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      vendor_business_id,
      vendor_name,
      service,
      price,
      customer_name,
      customer_phone,
      customer_address,
    } = req.body

    // 🔒 VALIDATION
    if (!vendor_business_id || !service || !price) {
      return res.status(400).json({
        message: "Missing booking data",
      })
    }

    // 🔍 Find vendor business (to get vendor_id)
    const business = await VendorBusiness.findByPk(vendor_business_id)

    if (!business) {
      return res.status(404).json({
        message: "Vendor business not found",
      })
    }

    // ✅ CREATE BOOKING
    const booking = await Booking.create({
      user_id: req.user.id,
      vendor_id: business.vendor_id,
      vendor_business_id: business.id,

      vendor_name: vendor_name,
      service: service,

      price: price,
      amount: price,

      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      customer_address: customer_address || null,

      status: "pending",
      payment_status: "pending",
    })

    console.log("✅ BOOKING INSERTED ID:", booking.id)

    res.status(201).json({
      bookingId: booking.id,
      booking,
    })
  } catch (err) {
    console.error("❌ CREATE BOOKING ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// =====================================================
// ✅ USER: CONFIRM PAYMENT
// POST /api/bookings/payment
// =====================================================
router.post("/payment", verifyToken, async (req, res) => {
  try {
    const { bookingId, method } = req.body

    const booking = await Booking.findByPk(bookingId)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.payment_method =
      method === "cash" ? "Pay on Event (Cash)" : "UPI"

    booking.payment_status = "paid"
    booking.status = "paid"

    await booking.save()

    console.log("💰 PAYMENT UPDATED:", booking.id)

    res.json({ message: "Payment successful", booking })
  } catch (err) {
    console.error("❌ PAYMENT ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// =====================================================
// 🆕 USER: PAYMENT ALIAS
// PUT /api/bookings/:id/pay
// =====================================================
router.put("/:id/pay", verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { payment_method, amount } = req.body

    const booking = await Booking.findByPk(id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.status = "paid"
    booking.amount = amount || booking.amount
    booking.payment_method = payment_method || booking.payment_method
    booking.payment_status = "paid"

    await booking.save()

    res.json({ message: "Booking marked paid", booking })
  } catch (err) {
    console.error("❌ PAYMENT UPDATE ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// =====================================================
// 🔥 VENDOR: GET BOOKINGS
// =====================================================
router.get("/vendor", verifyToken, isVendor, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { vendor_id: req.user.id },
      order: [["createdAt", "DESC"]],
    })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/vendor/all", verifyToken, isVendor, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { vendor_id: req.user.id },
      order: [["createdAt", "DESC"]],
    })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// =====================================================
// ⚠️ KEEP LAST
// =====================================================
router.get("/:slug", async (req, res) => {
  try {
    const vendor = await VendorBusiness.findOne({
      where: { slug: req.params.slug, approved: true },
    })

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    res.json(vendor)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
