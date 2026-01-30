const express = require("express")
const router = express.Router()

// 🔥 FIX: destructure middleware functions
const {
  verifyToken,
  isVendor,
} = require("../middleware/authMiddleware")

const vendorController = require("../controllers/vendorController")

// ================= AUTH =================

// Vendor Register
router.post(
  "/register",
  vendorController.registerVendor
)

// Vendor Login
router.post(
  "/login",
  vendorController.loginVendor
)

// ================= ADMIN =================

// Get all vendors (admin)
router.get(
  "/",
  vendorController.getVendors
)

// Approve vendor (admin)
router.put(
  "/approve/:id",
  vendorController.approveVendor
)

// =================================================
// 🔒 VENDOR DASHBOARD (AUTH REQUIRED)
// =================================================

// ✅ UPDATE VENDOR PROFILE
router.put(
  "/profile",
  verifyToken,
  isVendor,
  vendorController.updateVendorProfile
)

// 🔥 SAVE BUSINESS (MULTIPLE BUSINESSES SUPPORTED)
router.put(
  "/business",
  verifyToken,
  isVendor,
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
