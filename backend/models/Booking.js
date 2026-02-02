const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Booking = sequelize.define(
  "Booking",
  {
    // ================= EXISTING FIELDS (UNCHANGED) =================
    date: DataTypes.DATEONLY,
    time: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },

    // ================= ADDED FIELDS (DO NOT REMOVE) =================

    // 🔹 User who booked
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // 🔹 Vendor who will see this booking
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // 🔹 Vendor business that was booked
    vendor_business_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // 🔹 Optional customer info snapshot (safe add)
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    customer_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    customer_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Bookings",
    timestamps: true,
  }
)

module.exports = Booking
