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

      // 🆕 FLAGS (SAFE ADD)
      req.isAdmin = true
      req.isVendor = false
      req.isUser = false

      console.log("🛡️ Admin legacy token accepted")
      return next()
    }

    // =====================================================
    // 🔐 NORMAL JWT VERIFY (USER / VENDOR / ADMIN)
    // =====================================================
    console.log("Incoming token:", token)
console.log("JWT Secret:", process.env.JWT_SECRET)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token payload",
      })
    }

    // =====================================================
    // 🆕 ROLE NORMALIZATION (SAFE)
    // =====================================================
    const normalizedRole = decoded.role?.toLowerCase()

    req.user = {
      ...decoded,
      role: normalizedRole,
    }

    // 🆕 FLAGS (SAFE ADD)
    req.isAdmin = normalizedRole === "admin"
    req.isVendor = normalizedRole === "vendor"
    req.isUser = normalizedRole === "user"

    console.log(
      "🔐 Authenticated:",
      `ID=${req.user.id}`,
      `ROLE=${req.user.role}`
    )

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
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      message: "Vendor access only",
    })
  }

  // 🆕 SAFE LOG
  console.log("👤 Vendor access granted:", req.user.id)
  next()
}

// ================= ADMIN ONLY =================
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    })
  }

  // 🆕 SAFE LOG
  console.log("🛡️ Admin access granted:", req.user.id)
  next()
}

// ================= USER ONLY (🆕 OPTIONAL – SAFE) =================
const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      message: "User access only",
    })
  }

  console.log("👥 User access granted:", req.user.id)
  next()
}

module.exports = {
  verifyToken,
  isVendor,
  isAdmin,
  isUser, // 🆕 EXPORT SAFE (OPTIONAL)
}
