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

    // ================= BUSINESS INFO =================
    service_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
