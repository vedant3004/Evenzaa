const express = require("express")
const router = express.Router()

const {
  registerVendor,
  loginVendor,
  getVendors,
  approveVendor,
} = require("../controllers/vendorController")

router.post("/register", registerVendor)
router.post("/login", loginVendor)

// ADMIN
router.get("/", getVendors)
router.put("/approve/:id", approveVendor)

module.exports = router
