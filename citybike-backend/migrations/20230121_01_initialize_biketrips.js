const { DataTypes } = require('sequelize')
const axios = require('axios')
const csv = require('csvtojson')
const Biketrip = require('../models/biketrip')

const getcsvdata = async (dataUrl) => {
  const file = await axios({
    url: dataUrl,
    method: 'GET',
    responseType: 'text'
  })

  const jsonArray = await csv({
    noheader: false,
    headers: [
      'departureTime',
      'returnTime',
      'departureStationId',
      'departureStationName',
      'returnStationId',
      'returnStationName',
      'coveredDistance',
      'duration'
    ]
  }).fromString(file.data)

  let nro = 1000
  let offset = 0
  while (offset < jsonArray.length) {
    const chunk = jsonArray
      .slice(offset, nro)
      .filter((item) => item.coveredDistance > 10 && item.duration > 10)
    try {
      await Biketrip.bulkCreate(chunk, { validate: true })
      console.log(`Added rows from ${offset} to ${nro}`)
      offset = nro
      nro += 1000
    } catch (error) {
      console.log(error)
    }
  }
}

const dataUrls = [
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv',
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv',
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv'
]

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
    await Promise.all(
      dataUrls.map(async (dataUrl) => {
        console.log('Getting data, this may take a while, please wait...')
        await getcsvdata(dataUrl)
      })
    )
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('biketrips')
  }
}
