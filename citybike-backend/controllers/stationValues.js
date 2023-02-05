const router = require('express').Router()
const { Biketrip } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/:id', async (req, res) => {
  try {
    const tripsStarted = await Biketrip.count({
      where: {
        departureStationId: req.params.id
      }
    })
    const startedDistance = await Biketrip.sum('coveredDistance', {
      where: {
        departureStationId: req.params.id
      }
    })
    const tripsEnded = await Biketrip.count({
      where: {
        returnStationId: req.params.id
      }
    })
    const endedDistance = await Biketrip.sum('coveredDistance', {
      where: {
        returnStationId: req.params.id
      }
    })
    const popularDepartureStations = await Biketrip.findAll({
      limit: 5,
      attributes: [
        'departureStationName',
        [
          sequelize.fn('COUNT', sequelize.col('departure_station_name')),
          'popular_departure'
        ],
        'departureStationId',
      ],
      group: ['departureStationName', 'departureStationId'],
      order: [['popular_departure', 'DESC']],
      where: {
        returnStationId: req.params.id
      }
    })

    const popularReturnStations = await Biketrip.findAll({
      limit: 5,
      attributes: [
        'returnStationName',
        [
          sequelize.fn('COUNT', sequelize.col('return_station_name')),
          'popular_return'
        ],
        'returnStationId',
      ],
      group: ['returnStationId', 'returnStationName'],
      order: [['popular_return', 'DESC']],
      where: {
        departureStationId: req.params.id
      }
    })

    const values = {
      tripsStarted: tripsStarted,
      tripsEnded: tripsEnded,
      startedDistanceAvg: (
        Math.floor(startedDistance / 1000) / tripsStarted
      ).toFixed(2),
      endedDistanceAvg: (Math.floor(endedDistance / 1000) / tripsEnded).toFixed(
        2
      ),
      popularDepartureStations: popularDepartureStations,
      popularReturnStations: popularReturnStations
    }

    res.send(values)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
