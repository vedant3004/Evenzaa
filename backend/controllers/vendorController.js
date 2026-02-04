const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const slugify = require("slugify")

const Vendor = require("../models/Vendor")
const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")
const User = require("../models/User")
const sequelize = require("../db") // 🆕 ADDED

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
      status: "pending",
    })

    res.status(201).json({
      success: true,
      message: "Vendor registered. Pending admin approval.",
      vendor,
    })
  } catch (err) {
    console.error("VENDOR REGISTER ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= LOGIN VENDOR =================
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body

    const vendor = await Vendor.findOne({ where: { email } })
    if (!vendor) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (vendor.status !== "approved" || vendor.approved !== true) {
      return res.status(403).json({
        message: `Vendor account ${vendor.status}. Contact admin.`,
      })
    }

    const match = await bcrypt.compare(password, vendor.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign(
      { id: vendor.id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      token,
      vendor,
    })
  } catch (err) {
    console.error("VENDOR LOGIN ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= GET ALL VENDORS (ADMIN) =================
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      order: [["createdAt", "DESC"]],
    })
    res.json(vendors)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= APPROVE VENDOR (ADMIN) =================
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    vendor.approved = true
    vendor.status = "approved"
    await vendor.save()

    res.json({
      success: true,
      message: "Vendor approved successfully",
      vendor,
    })
  } catch (err) {
    console.error("APPROVE VENDOR ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= REJECT VENDOR (ADMIN) =================
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    vendor.approved = false
    vendor.status = "rejected"
    await vendor.save()

    res.json({
      success: true,
      message: "Vendor rejected successfully",
      vendor,
    })
  } catch (err) {
    console.error("REJECT VENDOR ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= UPDATE VENDOR PROFILE =================
exports.updateVendorProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const vendor = await Vendor.findByPk(req.user.id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    if (name) vendor.name = name
    if (email) vendor.email = email
    if (password) vendor.password = await bcrypt.hash(password, 10)

    await vendor.save()

    res.json({ success: true, vendor })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Profile update failed" })
  }
}

// ==========================================================
// 🆕 ADMIN: HARD DELETE VENDOR (SAFE + CASCADE)
// ==========================================================
exports.adminDeleteVendor = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { id } = req.params

    const vendor = await Vendor.findByPk(id, { transaction: t })
    if (!vendor) {
      await t.rollback()
      return res.status(404).json({ message: "Vendor not found" })
    }

    console.log("🗑️ Admin deleting vendor:", vendor.id, vendor.email)

    // 🔥 Delete vendor businesses
    await VendorBusiness.destroy({
      where: { vendor_id: vendor.id },
      transaction: t,
    })

    // 🔥 Delete vendor bookings
    await Booking.destroy({
      where: { vendor_id: vendor.id },
      transaction: t,
    })

    // 🔥 Delete vendor itself
    await vendor.destroy({ transaction: t })

    await t.commit()

    res.json({
      success: true,
      message: "Vendor and all related data deleted successfully",
    })
  } catch (err) {
    await t.rollback()
    console.error("ADMIN DELETE VENDOR ERROR:", err)
    res.status(500).json({ message: "Vendor delete failed" })
  }
}

// ==========================================================
// 🆕 GET BOOKINGS FOR LOGGED-IN VENDOR (🔥 MAIN FIX)
// ==========================================================
exports.getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.user.id

    const bookings = await Booking.findAll({
      where: { vendor_id: vendorId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    })

    res.json({
      success: true,
      bookings,
    })
  } catch (err) {
    console.error("GET VENDOR BOOKINGS ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= SAVE BUSINESS =================
exports.saveVendorBusiness = async (req, res) => {
  try {
    const vendorId = req.user.id
    const {
      business,
      service_type,
      price,
      city,
      phone,
      image,
      services,
      description,
    } = req.body

    if (!business || !service_type || !city) {
      return res.status(400).json({
        message: "Business name, service type and city are required",
      })
    }

    const baseSlug = slugify(business, { lower: true, strict: true })
    let slug = baseSlug
    let count = 1

    while (await VendorBusiness.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`
    }

    const record = await VendorBusiness.create({
      vendor_id: vendorId,
      business_name: business,
      slug,
      service_type,
      price,
      city,
      phone,
      image,
      services,
      description,
      approved: false,
      status: "pending",
    })

    res.json({
      success: true,
      message: "Business saved. Pending admin approval.",
      business: record,
    })
  } catch (err) {
    console.error("SAVE BUSINESS ERROR:", err)
    res.status(500).json({ message: "Server error while saving business" })
  }
}

// ================= ADMIN: GET PENDING BUSINESSES =================
exports.getPendingBusinesses = async (req, res) => {
  try {
    const list = await VendorBusiness.findAll({
      where: {
        approved: false,
        status: "pending",
      },
      include: [{ model: Vendor, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    })

    res.json(list)
  } catch (err) {
    console.error("GET PENDING ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= ADMIN: APPROVE BUSINESS =================
exports.approveBusiness = async (req, res) => {
  try {
    const business = await VendorBusiness.findByPk(req.params.id)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    business.approved = true
    business.status = "approved"
    await business.save()

    res.json({
      success: true,
      message: "Business approved successfully",
      business,
    })
  } catch (err) {
    console.error("APPROVE ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= ADMIN: REJECT BUSINESS =================
exports.rejectBusiness = async (req, res) => {
  try {
    const business = await VendorBusiness.findByPk(req.params.id)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    business.approved = false
    business.status = "rejected"
    await business.save()

    res.json({
      success: true,
      message: "Business rejected successfully",
      business,
    })
  } catch (err) {
    console.error("REJECT ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= PUBLIC: GET APPROVED BUSINESSES =================
exports.getPublicBusinesses = async (req, res) => {
  try {
    const list = await VendorBusiness.findAll({
      where: { approved: true },
      order: [["createdAt", "DESC"]],
      include: [{ model: Vendor, attributes: ["id", "name", "email"] }],
    })

    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= PUBLIC: GET BUSINESS BY SLUG =================
exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await VendorBusiness.findOne({
      where: { slug: req.params.slug, approved: true },
      include: [{ model: Vendor, attributes: ["id", "name", "email"] }],
    })

    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    res.json(business)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}
