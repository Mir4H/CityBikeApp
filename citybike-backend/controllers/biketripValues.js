const router = require('express').Router()
const { Biketrip } = require('../models')

router.get('/', async (req, res) => {
  try {
    const maxdistance = await Biketrip.max('coveredDistance')
    const maxduration = await Biketrip.max('duration')

    const values = {
      maxdistance: maxdistance,
      maxduration: maxduration
    }

    res.send(values)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router