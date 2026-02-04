const express = require("express")
const router = express.Router()

const {
  getPendingBusinesses,
  approveBusiness,
  rejectBusiness,
} = require("../controllers/vendorController")

// 🔥 Admin login controller (JWT generator)
const {
  adminLogin,
  deleteVendorByAdmin, // 🆕 ADDED
} = require("../controllers/adminController")

const { verifyToken, isAdmin } = require("../middleware/authMiddleware")

// =================================================
// ================= ADMIN AUTH ====================
// =================================================

// 🔹 Admin Login
// POST /api/admin/login
router.post(
  "/login",
  adminLogin
)

// =================================================
// ============ ADMIN BUSINESS APPROVAL ============
// =================================================

// 🔹 Get all pending businesses
// GET /api/admin/businesses/pending
router.get(
  "/businesses/pending",
  verifyToken,
  isAdmin,
  async (req, res, next) => {
    try {
      // 🔍 DEBUG (safe)
      console.log("✅ Admin fetching pending businesses")
      return await getPendingBusinesses(req, res)
    } catch (err) {
      console.error("❌ Pending business route error:", err)
      next(err)
    }
  }
)

// 🔹 Approve business
// PUT /api/admin/business/:id/approve
router.put(
  "/business/:id/approve",
  verifyToken,
  isAdmin,
  async (req, res, next) => {
    try {
      console.log("✅ Admin approving business ID:", req.params.id)
      return await approveBusiness(req, res)
    } catch (err) {
      console.error("❌ Approve business route error:", err)
      next(err)
    }
  }
)

// 🔹 Reject business
// PUT /api/admin/business/:id/reject
router.put(
  "/business/:id/reject",
  verifyToken,
  isAdmin,
  async (req, res, next) => {
    try {
      console.log("✅ Admin rejecting business ID:", req.params.id)
      return await rejectBusiness(req, res)
    } catch (err) {
      console.error("❌ Reject business route error:", err)
      next(err)
    }
  }
)

// =================================================
// ============ ADMIN VENDOR DELETE (🆕) ============
// =================================================

// 🔥 Delete vendor permanently
// DELETE /api/admin/vendor/:id
router.delete(
  "/vendor/:id",
  verifyToken,
  isAdmin,
  async (req, res, next) => {
    try {
      console.log("🗑️ Admin deleting vendor ID:", req.params.id)

      // 🔐 This internally deletes:
      // - Vendor
      // - VendorBusinesses
      // - Bookings
      // using transaction (safe)
      return await deleteVendorByAdmin(req, res)
    } catch (err) {
      console.error("❌ Delete vendor route error:", err)
      next(err)
    }
  }
)

module.exports = router
