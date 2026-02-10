const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
)

// ==================================================
// 🆕 AUTO DB SYNC (DEV MODE ONLY)
// ==================================================
// Ye ensure karega ki:
// - DB connection working hai
//
// ⚠️ IMPORTANT:
// - Existing database ke sath { alter: true }
//   MySQL me index explosion karta hai
// - Isliye sync DISABLED rakha gaya hai
// - Schema changes ke liye migrations use karo
// ==================================================

const syncDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connection established successfully.")

    // ❌ DISABLED: Causes "Too many keys" error
    /*
    await sequelize.sync({ alter: true })
    console.log("✅ Database synced with models (ALTER mode).")
    */

  } catch (error) {
    console.error("❌ Database connection failed:", error)
  }
}

// 🔥 Authenticate only (SAFE)
syncDatabase()

module.exports = sequelize
