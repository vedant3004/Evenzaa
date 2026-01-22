const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "vendor", "admin"),
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
)

module.exports = User
