const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const VendorBusiness = sequelize.define(
  "VendorBusiness",
  {
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: DataTypes.STRING,
    image: DataTypes.TEXT,

    services: {
      type: DataTypes.JSON,
      defaultValue: [],
    },

    description: DataTypes.TEXT,

    // 🔥 ADMIN APPROVAL SYSTEM
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },

    // ================= ADDED (SAFE – FOR BOOKINGS) =================

    // 🔹 Total bookings on this business
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // 🔹 Total earnings from this business
    total_earnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    // 🔹 Last booking date (optional analytics)
    last_booking_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "VendorBusinesses",
    timestamps: true,

    // =================================================
    // ============ ADMIN DELETE SAFETY (🆕) ============
    // =================================================
    hooks: {
      beforeDestroy: async (business, options) => {
        try {
          console.log(
            "🗑️ Deleting VendorBusiness safely:",
            business.id,
            "Vendor:",
            business.vendor_id
          )

          // 🔒 Future-proof:
          // yahan future me add kar sakte ho:
          // - bookings cleanup
          // - payments cleanup
          // - analytics cleanup

        } catch (err) {
          console.error(
            "❌ VendorBusiness beforeDestroy hook error:",
            err
          )
          throw err
        }
      },
    },
  }
)

module.exports = VendorBusiness
