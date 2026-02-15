const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Payment = sequelize.define("Payment", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // 🔥 EXISTING FIELDS (UNCHANGED)
  payment_id: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
  },

  // 🔥 EXISTING NEW FIELDS (UNCHANGED)
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  plan: {
    type: DataTypes.STRING,
  },

  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,          // ✅ SAFE DEFAULT ADDED
  },

  payment_method: {
    type: DataTypes.STRING,
  },

  payment_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },

  admin_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },

  // =================================================
  // 🔥 SAFE ADDITIONS (DO NOT BREAK EXISTING DATA)
  // =================================================

  // Optional booking link (future proof)
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  // Transaction reference (UPI/Card ref etc)
  transaction_ref: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Payment date (manual override support)
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  timestamps: true,
})

module.exports = Payment
