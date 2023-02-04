const { DataTypes } = require('sequelize')
const axios = require('axios')
const csv = require('csvtojson')
const Biketrip = require('../models/biketrip')

const getBiketripData = async (dataUrl) => {
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
  const filtered = jsonArray
    .filter((item) => item.coveredDistance > 10 && item.duration > 10)
    .reduce((acc, item) => {
      if (
        !acc.some(
          (entry) =>
            entry.departureTime === item.departureTime &&
            entry.returnTime === item.returnTime &&
            entry.coveredDistance === item.coveredDistance &&
            entry.departureStationId === item.departureStationId &&
            entry.returnStationId === item.returnStationId
        )
      ) {
        return [...acc, item]
      }
      return acc
    }, [])
  while (offset < filtered.length) {
    const chunk = filtered.slice(offset, nro)
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
/*
const dataUrls = [
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv',
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv',
  'https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv'
]*/

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
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    console.log(
      'Getting first set of data, this will take a while, please wait...'
    )
    await getBiketripData(
      'https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv'
    )
    console.log(
      'Getting second set of data, this may take a while, please wait...'
    )
    await getBiketripData(
      'https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv'
    )
    console.log(
      'Getting third set of data, this may take a while, please wait...'
    )
    await getBiketripData(
      'https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv'
    )
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('biketrips')
  }
}
