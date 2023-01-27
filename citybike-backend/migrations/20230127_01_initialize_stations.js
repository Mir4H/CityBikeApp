const { DataTypes } = require('sequelize')
const axios = require('axios')
const csv = require('csvtojson')
const Bikestation = require('../models/bikestation')

const getBikestationData = async () => {
  const file = await axios({
    url: 'https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv',
    method: 'GET',
    responseType: 'text'
  })

  const jsonArray = await csv({
    noheader: false,
    headers: [
      'fid',
      'id',
      'nameFinnish',
      'nameSwedish',
      'nameEnglish',
      'addressFinnish',
      'addressSwedish',
      'cityFinnish',
      'citySwedish',
      'operator',
      'capacity',
      'positionX',
      'positionY'
    ]
  }).fromString(file.data)

  try {
    console.log('Loading station data...')
    await Bikestation.bulkCreate(jsonArray, { validate: true })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('bikestations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
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
      },
      position_x: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      position_y: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    })
    getBikestationData()
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('bikestations')
  }
}
