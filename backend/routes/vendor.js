const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const vendorController = require("../controllers/vendorController")

// ================= AUTH =================
router.post("/register", vendorController.registerVendor)
router.post("/login", vendorController.loginVendor)

// ================= ADMIN =================
router.get("/", vendorController.getVendors)
router.put("/approve/:id", vendorController.approveVendor)

// =================================================
// 🔒 VENDOR DASHBOARD (AUTH REQUIRED)
// =================================================

// 🔥 SAVE / UPDATE BUSINESS LISTING
router.put(
  "/business",
  authMiddleware,
  vendorController.saveVendorBusiness
)

// =================================================
// 🌍 PUBLIC APIs (NO AUTH)
// =================================================

// 🔥 Vendors page → ALL APPROVED BUSINESSES
router.get(
  "/businesses",
  vendorController.getPublicBusinesses
)

// 🔥 Vendor slug page → SINGLE BUSINESS
router.get(
  "/businesses/:slug",
  vendorController.getBusinessBySlug
)

module.exports = router
