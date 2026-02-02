const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check existing user
    const exists = await User.findOne({ where: { email } })
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "user", // default user
    })

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" })
    }

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

// ================= 👑 ADMIN: GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" }, // 🔥 ONLY USERS
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    })

    return res.json(users)
  } catch (error) {
    console.error("GET USERS ERROR:", error)
    return res.status(500).json({ message: "Failed to fetch users" })
  }
}
