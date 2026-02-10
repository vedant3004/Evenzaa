const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Vendor = sequelize.define(
  "Vendor",
  {
    // ================= BASIC INFO =================
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ================= CONTACT INFO =================
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Vendor contact number (Account Settings)",
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ================= BUSINESS INFO =================
    service_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    services: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "List of services provided by vendor",
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Profile / business image URL",
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
    },

    // ================= ADMIN CONTROL =================
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },

    // ================= ROLE =================
    role: {
      type: DataTypes.STRING,
      defaultValue: "vendor",
    },

    // ================= DASHBOARD STATS =================

    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Cached total bookings count",
    },

    total_earnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: "Cached total earnings snapshot",
    },
  },
  {
    tableName: "Vendors",
    timestamps: true,

    // =================================================
    // ============ DEBUG + SAFETY HOOKS (🆕) ============
    // =================================================
    hooks: {
      beforeUpdate: async (vendor) => {
        console.log("✏️ Vendor BEFORE UPDATE:", {
          id: vendor.id,
          name: vendor.name,
          phone: vendor.phone,
          image: vendor.image,
        })
      },

      afterUpdate: async (vendor) => {
        console.log("✅ Vendor AFTER UPDATE (DB SAVED):", {
          id: vendor.id,
          name: vendor.name,
          phone: vendor.phone,
          image: vendor.image,
        })
      },

      beforeDestroy: async (vendor) => {
        try {
          console.log(
            "🗑️ Admin deleting vendor safely:",
            vendor.id,
            vendor.email
          )
        } catch (err) {
          console.error("❌ Vendor beforeDestroy hook error:", err)
          throw err
        }
      },
    },
  }
)

module.exports = Vendor
