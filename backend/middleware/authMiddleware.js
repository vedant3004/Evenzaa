const jwt = require("jsonwebtoken")

// ================= VERIFY TOKEN (COMMON) =================
const verifyToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      })
    }

    // =====================================================
    // 🔥 ADMIN SHORT-CIRCUIT (IMPORTANT FIX)
    // =====================================================
    // If admin token is simple string (frontend legacy)
    if (token === "admin") {
      req.user = {
        id: 0,
        role: "admin",
      }
      return next()
    }

    // =====================================================
    // 🔐 NORMAL JWT VERIFY (USER / VENDOR)
    // =====================================================
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token payload",
      })
    }

    req.user = decoded
    next()
  } catch (err) {
    console.error("🔥 AUTH ERROR:", err.message)
    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}

// ================= VENDOR ONLY =================
const isVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({
      message: "Vendor access only",
    })
  }
  next()
}

// ================= ADMIN ONLY =================
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    })
  }
  next()
}

module.exports = {
  verifyToken,
  isVendor,
  isAdmin,
}
