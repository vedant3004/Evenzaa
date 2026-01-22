const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

// ================= AUTH ROUTES =================

// Register (User / Vendor / Admin)
router.post("/register", authController.register)

// Login (User / Vendor / Admin)
router.post("/login", authController.login)

module.exports = router
