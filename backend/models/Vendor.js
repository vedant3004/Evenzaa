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
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
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

    // ================= ADDED (SAFE – FUTURE USE) =================

    // 🔹 Total bookings count (optional dashboard stat)
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // 🔹 Total earnings snapshot (safe, optional)
    total_earnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "Vendors",
    timestamps: true,
  }
)

module.exports = Vendor
