const express = require("express")
const router = express.Router()

// 🔥 Middleware
const {
  verifyToken,
  isVendor,
  isAdmin,
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

// 🆕 ✅ UPDATE VENDOR ACCOUNT SETTINGS
router.put(
  "/account",
  verifyToken,
  isVendor,
  vendorController.updateVendorAccount
)

// 🔥 SAVE BUSINESS
router.put(
  "/business",
  verifyToken,
  isVendor,
  vendorController.saveVendorBusiness
)

// 🔥 PROCESS PAYMENT (NEW – ADDED ONLY)
router.post(
  "/pay/:id",
  verifyToken,
  isVendor,
  vendorController.processPayment
)

// =================================================
// 🆕 🔥 VENDOR BOOKINGS
// =================================================

router.get(
  "/bookings",
  verifyToken,
  isVendor,
  vendorController.getVendorBookings
)

// =================================================
// 🌍 PUBLIC APIs
// =================================================
// 🔥 GET SINGLE BUSINESS BY ID (FOR PAYMENT PAGE)
router.get(
  "/business/:id",
  verifyToken,
  isVendor,
  vendorController.getBusinessById
)

// ALL APPROVED BUSINESSES
// ALL APPROVED BUSINESSES (WITH RATING)
router.get(
  "/businesses",
  vendorController.getAllBusinesses
)


// SINGLE BUSINESS BY SLUG
router.get(
  "/businesses/:slug",
  vendorController.getBusinessBySlug
)
// ================= PUBLIC: SEARCH =================
router.get(
  "/search",
  vendorController.searchBusinesses
)
// =================================================
// ADMIN HARD DELETE PLACEHOLDER
// =================================================
// SINGLE BUSINESS BY SLUG
// router.get(
//   "/businesses/:slug",
//   vendorController.getBusinessBySlug
// )

// ================= PUBLIC: BUSINESSES BY CATEGORY =================
router.get(
  "/category/:category",
  vendorController.getBusinessesByCategory
)

module.exports = router

