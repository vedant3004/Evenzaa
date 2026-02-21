const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const slugify = require("slugify")

const Vendor = require("../models/Vendor")
const VendorBusiness = require("../models/VendorBusiness")
const Booking = require("../models/Booking")
const User = require("../models/User")
const sequelize = require("../db") // 🆕 ADDED
const Payment = require("../models/Payment") // 🔥 ADD THIS LINE


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
// 🆕 UPDATE VENDOR ACCOUNT (ACCOUNT SETTINGS)
// ==========================================================
exports.updateVendorAccount = async (req, res) => {
  try {
    const { name, phone, image, password } = req.body

    const vendor = await Vendor.findByPk(req.user.id)
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // BASIC DETAILS
    if (name !== undefined) vendor.name = name
    if (phone !== undefined) vendor.phone = phone
    if (image !== undefined) vendor.image = image

    // PASSWORD (OPTIONAL)
    if (password && password.length >= 6) {
      vendor.password = await bcrypt.hash(password, 10)
    }

    await vendor.save()

    res.json({
      success: true,
      message: "Account settings updated successfully",
      vendor,
    })
  } catch (err) {
    console.error("UPDATE VENDOR ACCOUNT ERROR:", err)
    res.status(500).json({ message: "Server error" })
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

    // Delete vendor businesses
    await VendorBusiness.destroy({
      where: { vendor_id: vendor.id },
      transaction: t,
    })

    // Delete vendor bookings
    await Booking.destroy({
      where: { vendor_id: vendor.id },
      transaction: t,
    })

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

// ================= GET BOOKINGS FOR LOGGED-IN VENDOR =================
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
  category,
  price,               // 🔥 SERVICE PRICE
  membership_price,    // 🔥 PLAN PRICE
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

//    const record = await VendorBusiness.create({
//   vendor_id: vendorId,
//   business_name: business,
//   slug,
//   service_type,
//   category, // 🔥 ADDED
//   price,
//   membership_price, 
//   city,
//   phone,
//   image,
//   services,
//   description,
//   approved: false,
//   status: "pending",
// })
const record = await VendorBusiness.create({
  vendor_id: vendorId,
  business_name: business,
  slug,
  service_type,
  category,
  price,
  membership_price,
  city,
  phone,
  image,
  services: Array.isArray(services)
    ? services
    : services
      ? services.split(",").map(s => s.trim())
      : [],
  description,
  approved: false,
  status: "pending",
})



 res.json({
  success: true,
  message: "Business saved. Pending admin approval.",
  businessId: record.id,   // 🔥 IMPORTANT
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
      where: { approved: false, status: "pending" },
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
exports.getAllBusinesses = async (req, res) => {
  try {
    const [businesses] = await sequelize.query(`
      SELECT 
        vb.*,
        IFNULL(ROUND(AVG(r.rating),1), 0) as rating,
        COUNT(r.id) as total_reviews
      FROM vendorbusinesses vb
      LEFT JOIN reviews r ON vb.id = r.vendor_id
      WHERE vb.status = 'approved'
      GROUP BY vb.id
    `)

    res.json(businesses)
  } catch (error) {
    console.error("GET BUSINESSES ERROR:", error)
    res.status(500).json({ message: "Server Error" })
  }
}




// ================= PUBLIC: GET BUSINESS BY SLUG =================
// ================= PUBLIC: GET BUSINESS BY SLUG =================
exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await VendorBusiness.findOne({
      where: { slug: req.params.slug, status: "approved" },
      include: [{ model: Vendor, attributes: ["id", "name", "email"] }],
    })

    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    const businessData = business.toJSON()

    // ✅ FIX: Convert services properly
    if (Array.isArray(businessData.services)) {
      // already correct
    } else if (typeof businessData.services === "string") {
      businessData.services = businessData.services
        .split(",")
        .map(s => s.trim())
    } else {
      businessData.services = []
    }

    res.json(businessData)

  } catch (err) {
    console.error("GET BUSINESS BY SLUG ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}


// ================= GET BUSINESS BY ID (FOR PAYMENT PAGE) =================
exports.getBusinessById = async (req, res) => {
  try {
    const business = await VendorBusiness.findByPk(req.params.id)

    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    res.json(business)

  } catch (err) {
    console.error("GET BUSINESS BY ID ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ================= PROCESS PAYMENT =================


exports.processPayment = async (req, res) => {
  console.log("🔥 PROCESS PAYMENT CALLED")
console.log("Vendor ID:", req.user.id)
console.log("Business ID:", req.params.id)
  try {
    
    const vendorId = req.user.id
    const businessId = req.params.id
    const { payment_method } = req.body

    const business = await VendorBusiness.findByPk(businessId)

    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    const payment = await Payment.create({
      payment_id: "PAY-" + Date.now(),
      status: "paid",
      vendor_id: vendorId,
      business_id: businessId,
      plan: business.service_type,
      amount: business.membership_price,
      payment_method,
      payment_status: "paid",
      admin_status: "pending",
    })

    res.json({
      success: true,
      message: "Payment recorded. Waiting for admin approval.",
      payment,
    })

  } catch (err) {
    console.error("PAYMENT ERROR:", err)
    res.status(500).json({ message: "Payment failed" })
  }
}
// ================= PUBLIC: GET BUSINESSES BY CATEGORY =================
exports.getBusinessesByCategory = async (req, res) => {
  try {
    const { category } = req.params

    const [list] = await sequelize.query(`
      SELECT 
        vb.*,
        IFNULL(ROUND(AVG(r.rating),1), 0) as rating,
        COUNT(r.id) as total_reviews
      FROM vendorbusinesses vb
      LEFT JOIN reviews r ON vb.id = r.vendor_id
      WHERE vb.status = 'approved'
      AND vb.category = ?
      GROUP BY vb.id
    `, {
      replacements: [category],
    })

    res.json(list)
  } catch (err) {
    console.error("GET BY CATEGORY ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}
// ================= PUBLIC: SEARCH BUSINESSES =================
exports.searchBusinesses = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.json([])
    }

    const [results] = await sequelize.query(`
      SELECT 
        vb.id,
        vb.business_name,
        vb.slug,
        vb.category,
        vb.city,
        vb.service_type
      FROM VendorBusinesses vb
      WHERE vb.status = 'approved'
      AND (
        vb.business_name LIKE :search
        OR vb.category LIKE :search
        OR vb.service_type LIKE :search
        OR vb.city LIKE :search
      )
      ORDER BY vb.createdAt DESC
      LIMIT 10
    `, {
      replacements: { search: `%${q}%` }
    })

    res.json(results)

  } catch (err) {
    console.error("SEARCH ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}
