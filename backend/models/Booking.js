const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Booking = sequelize.define(
  "Booking",
  {
    // ================= EXISTING FIELDS =================
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "confirmed"),
      defaultValue: "pending",
    },

    // ================= USER / VENDOR =================
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    vendor_business_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // ================= SNAPSHOT =================
    vendor_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    service: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // ================= CUSTOMER =================
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

    // ================= PAYMENT =================
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "Bookings",
    timestamps: true,

    hooks: {
      beforeDestroy: async (booking) => {
        console.log(
          "🗑️ Deleting booking:",
          booking.id,
          booking.vendor_id,
          booking.user_id
        )
      },
    },
  }
)

module.exports = Booking
