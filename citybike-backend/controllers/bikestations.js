const router = require('express').Router()
const { Bikestation } = require('../models')

const pagination = (page, size) => {
  const limit = size ? +size : 15
  const offset = page ? page * limit : 0

  return { limit, offset }
}

const paginationData = (data, page, limit) => {
  const { count: totalItems, rows: bikestations } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, bikestations, totalPages, currentPage }
}

router.get('/', (req, res) => {
  let where = {}
  const { page, size } = req.query
  const { limit, offset } = pagination(page, size)

  Bikestation.findAndCountAll({ where, limit, offset })
    .then((data) => {
      const response = paginationData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving bikestations.'
      })
    })
})

module.exports = router
