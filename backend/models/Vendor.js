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
      // ["Birthday Decoration", "Wedding Setup", ...]
      type: DataTypes.JSON,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    image: {
      // banner / cover image
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5, // ⭐ default trust rating
    },

    // ================= ADMIN CONTROL =================
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // ❌ admin approve karega
    },

    // ================= ROLE (FUTURE SAFE) =================
    role: {
      type: DataTypes.STRING,
      defaultValue: "vendor",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
)

module.exports = Vendor
