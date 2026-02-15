const Payment = require("../models/Payment")
const VendorBusiness = require("../models/VendorBusiness")

const jwt = require("jsonwebtoken")

// 🆕 Vendor model import (ADD ONLY)
const Vendor = require("../models/Vendor")

// 🔥 ADMIN CREDENTIALS FROM ENV (frontend ke same)
const ADMIN = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
}

exports.adminLogin = (req, res) => {
  try {
    const { username, password } = req.body

    if (
      username !== ADMIN.username ||
      password !== ADMIN.password
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      })
    }

    const token = jwt.sign(
      { id: 1, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      token,
    })
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err)
    res.status(500).json({
      message: "Server error during admin login",
    })
  }
}

// =================================================
// ============ DELETE VENDOR (🆕) =================
// =================================================

exports.deleteVendorByAdmin = async (req, res) => {
  try {
    const { id } = req.params

    // safety check
    if (!id) {
      return res.status(400).json({
        message: "Vendor ID required",
      })
    }

    const vendor = await Vendor.findByPk
      ? await Vendor.findByPk(id)     // Sequelize (MySQL)
      : await Vendor.findById(id)     // Mongoose (Mongo)

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    // delete vendor
    if (vendor.destroy) {
      await vendor.destroy()          // Sequelize
    } else {
      await vendor.deleteOne()        // Mongoose
    }

    return res.json({
      success: true,
      message: "Vendor deleted successfully",
    })
  } catch (err) {
    console.error("❌ DELETE VENDOR ERROR:", err)
    res.status(500).json({
      message: "Failed to delete vendor",
    })
  }
}
// =================================================
// ============ GET ALL PAYMENTS ===================
// =================================================

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: VendorBusiness,
          attributes: [
            "business_name",
            "service_type",
            "category",
          ],
        },
      ],
    })

    return res.json(payments)
  } catch (err) {
    console.error("❌ ADMIN PAYMENT FETCH ERROR:", err)
    res.status(500).json({
      message: "Failed to fetch payments",
    })
  }
}



// ================= GET ALL PAYMENTS (ADMIN REVENUE) =================
exports.getAllPayments = async (req, res) => {
  try {

    const payments = await Payment.findAll({
      where: { payment_status: "paid" },   // 🔥 only successful payments
      include: [
        {
          model: Vendor,
          attributes: ["id", "name", "email"],
        },
        {
          model: VendorBusiness,
          attributes: ["id", "business_name", "city"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(payments)

  } catch (err) {
    console.error("GET ALL PAYMENTS ERROR:", err)
    res.status(500).json({ message: "Failed to fetch payments" })
  }
}

