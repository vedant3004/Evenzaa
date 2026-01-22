const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Booking = sequelize.define("Booking", {
  date: DataTypes.DATEONLY,
  time: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM("pending", "paid"),
    defaultValue: "pending",
  },
})

module.exports = Booking
