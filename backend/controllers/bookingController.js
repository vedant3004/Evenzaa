const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")
const User = require("../models/User")
const Vendor = require("../models/Vendor")

// ================= GET VENDOR FOR BOOKING =================
// GET /api/bookings/:slug
exports.getVendorForBooking = async (req, res) => {
  try {
    const { slug } = req.params

    const vendor = await VendorBusiness.findOne({
      where: { slug, approved: true },
      include: [
        {
          model: Vendor,
          attributes: ["id", "name", "email"],
        },
      ],
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
      event_date,
      time,
      amount,
    } = req.body

    const userId = req.user?.id // 🔥 FROM JWT

    if (!vendor_business_id || !event_date || !userId) {
      return res.status(400).json({ message: "All fields required" })
    }

    const business = await VendorBusiness.findByPk(vendor_business_id)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    const vendor = await Vendor.findByPk(business.vendor_id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    const user = await User.findByPk(userId)

    const booking = await Booking.create({
      user_id: userId,
      vendor_id: vendor.id,
      vendor_business_id,
      date: event_date,
      time,
      amount,
      status: "pending",
      customer_name: user?.name || null,
      customer_phone: user?.phone || null,
      customer_address: user?.address || null,
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

// ================= GET VENDOR BOOKINGS =================
// GET /api/bookings/vendor
exports.getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.user.id

    const bookings = await Booking.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone", "address"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(bookings)
  } catch (err) {
    console.error("❌ VENDOR BOOKINGS ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// =======================================================
// 🔥 UPDATE BOOKING STATUS (NEW - SAFE ADD)
// PUT /api/bookings/:id/status
// =======================================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "paid", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const booking = await Booking.findByPk(id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // 🔐 Vendor can update only their booking
    if (booking.vendor_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    booking.status = status
    await booking.save()

    res.json({
      success: true,
      message: "Booking status updated",
      booking,
    })
  } catch (err) {
    console.error("❌ UPDATE BOOKING STATUS ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}
