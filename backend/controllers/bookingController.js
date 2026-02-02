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

    const userId = req.user?.id   // 🔥 FROM JWT (USER LOGIN REQUIRED)

    if (!vendor_business_id || !event_date || !userId) {
      return res.status(400).json({ message: "All fields required" })
    }

    // 🔍 Fetch vendor business
    const business = await VendorBusiness.findByPk(vendor_business_id)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    // 🔍 Fetch vendor (owner of business)
    const vendor = await Vendor.findByPk(business.vendor_id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // 🔍 Fetch user details
    const user = await User.findByPk(userId)

    // ✅ CREATE BOOKING (FULL LINKING)
    const booking = await Booking.create({
      user_id: userId,                 // 🔥 USER
      vendor_id: vendor.id,             // 🔥 VENDOR
      date: event_date,
      time,
      amount,
      status: "pending",
    })

    res.status(201).json({
      success: true,
      message: "✅ Booking placed successfully",
      booking,
      user: {
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
      },
      vendor: {
        name: vendor.name,
        email: vendor.email,
      },
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
