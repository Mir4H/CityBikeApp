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

router.get('/', async (req, res) => {
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
    console.log(sorting)
    order = [[sorting], ['createdAt']]
  }

  Biketrip.findAndCountAll({ where, order, limit, offset })
    .then((data) => {
      const response = paginationData(data, page, limit)
      res.send(response)
      console.log(response.biketrips.map(item => item.id))
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving biketrips.'
      })
    })
})

router.delete('/:id', async (req, res) => {
  console.log(req.params.id)
  const biketrip = await Biketrip.findByPk(req.params.id)
  console.log(biketrip)
  if (biketrip) {
    await biketrip.destroy()
    res.status(204).end()
  }
})

module.exports = router
