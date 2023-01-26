const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('biketrips', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true
        }
      },
      return_time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true
        }
      },
      departure_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      departure_station_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      return_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      return_station_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      covered_distance: {
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
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('biketrips')
  }
}
