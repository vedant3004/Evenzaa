const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    // 🔥 FIX 1: handle header safely (case-insensitive)
    const authHeader =
      req.headers.authorization || req.headers.Authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      })
    }

    // 🔥 FIX 2: safely extract token
    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      })
    }

    // 🔥 FIX 3: verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔥 FIX 4: strict but safe role check
    if (!decoded || decoded.role !== "vendor") {
      return res.status(403).json({
        message: "Vendor access only",
      })
    }

    // 🔥 FIX 5: ensure id exists (VERY IMPORTANT)
    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      })
    }

    // attach user
    req.user = decoded

    next()
  } catch (err) {
    console.error("🔥 AUTH MIDDLEWARE ERROR:", err.message)

    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}
