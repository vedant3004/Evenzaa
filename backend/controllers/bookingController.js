const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")

// ================= GET VENDOR FOR BOOKING =================
// GET /api/bookings/:slug
exports.getVendorForBooking = async (req, res) => {
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
}

// ================= CREATE BOOKING =================
// POST /api/bookings/create
exports.createBooking = async (req, res) => {
  try {
    const {
      vendor_business_id,
      name,
      phone,
      event_date,
      message,
    } = req.body

    if (!vendor_business_id || !name || !phone || !event_date) {
      return res.status(400).json({ message: "All fields required" })
    }

    const booking = await Booking.create({
      vendor_business_id,
      name,
      phone,
      event_date,
      message,
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
}
