const express = require("express")
const router = express.Router()

// 🔥 Middleware
const {
  verifyToken,
  isVendor,
  isAdmin, // ✅ ADD
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

// Get all vendors (ADMIN)
router.get(
  "/",
  verifyToken,
  isAdmin,
  vendorController.getVendors
)

// ✅ APPROVE VENDOR (ADMIN)
router.put(
  "/approve/:id",
  verifyToken,
  isAdmin,
  vendorController.approveVendor
)

// ❌ REJECT VENDOR (ADMIN)
router.put(
  "/reject/:id",
  verifyToken,
  isAdmin,
  vendorController.rejectVendor
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
// 🆕 🔥 VENDOR BOOKINGS (NEW – DO NOT REMOVE)
// =================================================

// ✅ GET BOOKINGS FOR LOGGED-IN VENDOR
// GET /api/vendor/bookings
router.get(
  "/bookings",
  verifyToken,
  isVendor,
  vendorController.getVendorBookings
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

// =================================================
// 🆕 ADMIN HARD DELETE (SAFE PLACEHOLDER)
// =================================================

// ❌ Vendor delete handled ONLY via /api/admin/vendor/:id
// (intentionally not exposing delete here for safety)

module.exports = router
