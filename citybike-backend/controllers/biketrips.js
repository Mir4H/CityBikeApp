const router = require('express').Router()
const { Biketrip } = require('../models')
const { Op } = require('sequelize')

const pagination = (page, size) => {
  const limit = size ? size : 15
  const offset = page ? page * limit : 0
  return { limit, offset }
}

const paginationData = (data, page, limit) => {
  const { count: totalItems, rows: biketrips } = data
  const currentPage = page ? page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, biketrips, totalPages, currentPage }
}

router.get('/', (req, res) => {
  let where = {}
  let order = [['id']]
  const { page, size } = req.query
  const { limit, offset } = pagination(page, size)

  if (req.query.search) {
    const searchUp =
      req.query.search.charAt(0).toUpperCase() + req.query.search.slice(1)
    where = {
      [Op.or]: [
        {
          departureStationName: {
            [Op.substring]: searchUp
          }
        },
        {
          returnStationName: {
            [Op.substring]: searchUp
          }
        }
      ]
    }
  }

  if (req.query.order) {
    const sorting = req.query.order.split(',')
    order = [[sorting], ['createdAt']]
  }

  if (req.query.distance) {
    const distance = req.query.distance.split(',')
    where = {
      ...where,
      coveredDistance: {
        [Op.between]: distance
      }
    }
  }

  if (req.query.duration) {
    const duration = req.query.duration.split(',')
    where = {
      ...where,
      duration: {
        [Op.between]: duration
      }
    }
  }

  Biketrip.findAndCountAll({ where, order, limit, offset })
    .then((data) => {
      const response = paginationData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving biketrips.'
      })
    })
})

router.get('/:id', async (req, res) => {
  try {
    const biketrip = await Biketrip.findByPk(req.params.id)
    res.send(biketrip)
  } catch (error) {
    console.log(error)
  }
})


module.exports = router
