const jwt = require("jsonwebtoken")

// 🔥 ADMIN CREDENTIALS FROM ENV (frontend ke same)
const ADMIN = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
}

exports.adminLogin = (req, res) => {
  try {
    const { username, password } = req.body

    if (
      username !== ADMIN.username ||
      password !== ADMIN.password
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      })
    }

    const token = jwt.sign(
      { id: 1, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      token,
    })
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err)
    res.status(500).json({
      message: "Server error during admin login",
    })
  }
}
