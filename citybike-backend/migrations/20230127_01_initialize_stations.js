const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('bikestations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name_finnish: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      name_swedish: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      address_finnish: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      address_swedish: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      position_x: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      position_y: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      city_finnish: {
        type: DataTypes.TEXT
      },
      city_swedish: {
        type: DataTypes.TEXT
      },
      operator: {
        type: DataTypes.TEXT
      },
      capacity: {
        type: DataTypes.INTEGER
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('bikestations')
  }
}
