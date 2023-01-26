const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Biketrip extends Model {}

Biketrip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    returnTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    departureStationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureStationName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    returnStationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    returnStationName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    coveredDistance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 10
      }
    },
    duration: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 10
      }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'biketrip'
  }
)

module.exports = Biketrip
