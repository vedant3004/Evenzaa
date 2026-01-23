const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const slugify = require("slugify")

const Vendor = require("../models/Vendor")
const VendorBusiness = require("../models/VendorBusiness")

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
      approved: true, // ✅ DEV MODE AUTO APPROVE
    })

    res.status(201).json({
      message: "Vendor registered successfully",
      vendor,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= LOGIN VENDOR =================
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body

    const vendor = await Vendor.findOne({ where: { email } })
    if (!vendor) {
      return res.status(400).json({ message: "Invalid email" })
    }

    const match = await bcrypt.compare(password, vendor.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { id: vendor.id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token, vendor })
  } catch (err) {
    console.error(err)
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
    const { id } = req.params

    const vendor = await Vendor.findByPk(id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    vendor.approved = true
    await vendor.save()

    res.json({ message: "Vendor approved successfully" })
  } catch (err) {
    console.error(err)
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
    if (password) {
      vendor.password = await bcrypt.hash(password, 10)
    }

    await vendor.save()

    res.json({ success: true, vendor })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Profile update failed" })
  }
}

// ==========================================================
// 🔥 BUSINESS LISTING (MAIN FEATURE)
// ==========================================================

// ================= SAVE / UPDATE BUSINESS =================
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

    const slug = slugify(business, { lower: true, strict: true })

    let record = await VendorBusiness.findOne({
      where: { vendor_id: vendorId },
    })

    if (record) {
      await record.update({
        business_name: business,
        slug,
        service_type,
        price,
        city,
        phone,
        image,
        services,
        description,
        approved: true, // ✅ DEV MODE AUTO APPROVE
      })
    } else {
      record = await VendorBusiness.create({
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
        approved: true, // ✅ DEV MODE AUTO APPROVE
      })
    }

    res.json({
      success: true,
      message: "✅ Business saved & LIVE on vendors page",
      business: record,
    })
  } catch (err) {
    console.error("🔥 SAVE BUSINESS ERROR:", err)
    res.status(500).json({ message: "Server error while saving business" })
  }
}

// ================= PUBLIC: GET ALL BUSINESSES =================
exports.getPublicBusinesses = async (req, res) => {
  try {
    const list = await VendorBusiness.findAll({
      where: { approved: true },
      order: [["createdAt", "DESC"]],
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
      where: {
        slug: req.params.slug,
        approved: true,
      },
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
