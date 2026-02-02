const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User")

// =================================================
// 🔐 AUTH ROUTES
// =================================================

// ✅ Register (User / Vendor / Admin)
router.post(
  "/register",
  authController.register
)

// ✅ Login (User / Vendor / Admin)
router.post(
  "/login",
  authController.login
)

// =================================================
// 👑 ADMIN – GET ALL USERS (✅ FIX)
// =================================================
router.get(
  "/users",
  authMiddleware.verifyToken,     // JWT required
  authMiddleware.isAdmin,         // ADMIN only
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        where: { role: "user" },   // 🔥 ONLY USERS
        order: [["createdAt", "DESC"]],
      })

      return res.json(users)
    } catch (err) {
      console.error("❌ Admin fetch users error:", err)
      return res.status(500).json({ message: "Failed to fetch users" })
    }
  }
)

module.exports = router
