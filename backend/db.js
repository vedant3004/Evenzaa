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
// - Vendor model ke naye fields (phone, image, etc.)
// - Database table me actually exist kare
//
// ⚠️ Production me { alter: true } avoid karna
// ==================================================

const syncDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connection established successfully.")

    await sequelize.sync({ alter: true })
    console.log("✅ Database synced with models (ALTER mode).")
  } catch (error) {
    console.error("❌ Database connection / sync failed:", error)
  }
}

// 🔥 Immediately sync on startup (safe for dev)
syncDatabase()

module.exports = sequelize