const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Bikestation extends Model {}

Bikestation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    nameFinnish: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nameSwedish: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    addressFinnish: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    addressSwedish: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    positionX: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    positionY: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cityFinnish: {
      type: DataTypes.TEXT
    },
    citySwedish: {
      type: DataTypes.TEXT
    },
    operator: {
      type: DataTypes.TEXT
    },
    capacity: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'bikestation'
  }
)

module.exports = Bikestation
