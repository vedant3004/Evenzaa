const express = require("express")
const router = express.Router()

const { addReview, getVendorReviews } = require("../controllers/reviewController")
const { verifyToken } = require("../middleware/authMiddleware")

// 🔥 User must be logged in to add review
router.post("/", verifyToken, addReview)

// 🔥 Anyone can see reviews
router.get("/:vendorId", getVendorReviews)

module.exports = router
