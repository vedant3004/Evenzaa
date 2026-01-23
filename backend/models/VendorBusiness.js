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

    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // 🔥 DEV MODE → AUTO APPROVE
    },
  },
  {
    timestamps: true,
  }
)

module.exports = VendorBusiness
