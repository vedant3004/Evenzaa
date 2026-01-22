const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Payment = sequelize.define("Payment", {
  payment_id: DataTypes.STRING,
  status: DataTypes.STRING,
})

module.exports = Payment
