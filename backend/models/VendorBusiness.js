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
      defaultValue: false, // ❌ DEV MODE OFF → ADMIN APPROVAL REQUIRED
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = VendorBusiness
