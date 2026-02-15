const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const MembershipPayment = sequelize.define(
  "MembershipPayment",
  {
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    plan: {
      type: DataTypes.ENUM("Silver", "Gold"),
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.ENUM(
        "UPI",
        "Credit Card",
        "Debit Card",
        "Net Banking"
      ),
      allowNull: false,
    },

    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "MembershipPayments",
    timestamps: true,
  }
)

module.exports = MembershipPayment
