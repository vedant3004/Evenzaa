const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Vendor = require("../models/Vendor")

// ================= REGISTER VENDOR =================
exports.registerVendor = async (req, res) => {
  try {
    const { name, email, password, service_type, price } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const exists = await Vendor.findOne({ where: { email } })
    if (exists) {
      return res.status(400).json({ message: "Vendor already exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const vendor = await Vendor.create({
      name,
      email,
      password: hash,
      service_type,
      price,
      approved: false,
    })

    res.status(201).json({
      message: "Vendor registered, waiting for admin approval",
      vendor,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// ================= LOGIN VENDOR =================
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body

    const vendor = await Vendor.findOne({ where: { email } })
    if (!vendor) return res.status(400).json({ message: "Invalid email" })

    if (!vendor.approved) {
      return res.status(403).json({ message: "Admin approval pending" })
    }

    const match = await bcrypt.compare(password, vendor.password)
    if (!match) return res.status(400).json({ message: "Invalid password" })

    const token = jwt.sign(
      { id: vendor.id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token, vendor })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// ================= GET ALL VENDORS (ADMIN) =================
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({ order: [["createdAt", "DESC"]] })
    res.json(vendors)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// ================= APPROVE VENDOR (ADMIN) =================
exports.approveVendor = async (req, res) => {
  try {
    const { id } = req.params

    const vendor = await Vendor.findByPk(id)
    if (!vendor) return res.status(404).json({ message: "Vendor not found" })

    vendor.approved = true
    await vendor.save()

    res.json({ message: "Vendor approved successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
