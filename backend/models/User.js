const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const User = sequelize.define(
  "User",
  {
    // ================= BASIC =================
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "vendor", "admin"),
      defaultValue: "user",
    },

    // ================= 🔥 ADDED (DO NOT REMOVE) =================
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    // =================================================
    // ============ DELETE SAFETY (🆕) =================
    // =================================================
    hooks: {
      beforeDestroy: async (user, options) => {
        try {
          console.log("🗑️ Deleting user safely:", user.id, user.email)
          // future: bookings cleanup, logs, analytics
        } catch (err) {
          console.error("❌ User beforeDestroy hook error:", err)
          throw err
        }
      },
    },
  }
)

module.exports = User
