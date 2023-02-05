const { DataTypes } = require('sequelize')
const axios = require('axios')
const csv = require('csvtojson')
const Biketrip = require('../models/biketrip')
const sequelize = require('../utils/db')

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
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    if (process.env.NODE_ENV !== 'test') {
      try {
        await Promise.all(
          dataUrls.map(async (dataUrl) => {
            console.log('Getting data, this may take a while, please wait...')
            await getBiketripData(dataUrl)
          })
        )
        await sequelize.sequelize.query(
          'DELETE FROM biketrips WHERE id IN (SELECT r1.id FROM biketrips r1 JOIN biketrips r2 ON r1.departure_time = r2.departure_time AND r1.return_time = r2.return_time AND r1.covered_distance = r2.covered_distance AND r1.departure_station_id = r2.departure_station_id AND r1.return_station_id = r2.return_station_id AND r2.id < r1.id);'
        )
      } catch (error) {
        console.log(error)
      }
    }
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('biketrips')
  }
}
