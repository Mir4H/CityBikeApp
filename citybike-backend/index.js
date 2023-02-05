const express = require('express')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const biketripsRouter = require('./controllers/biketrips')
const bikestationsRouter = require('./controllers/bikestations')
const valueRouter = require('./controllers/biketripValues')
const stationValueRouter = require('./controllers/stationValues')

app.use(express.json())

app.use('/api/biketrips', biketripsRouter)
app.use('/api/bikestations', bikestationsRouter)
app.use('/api/values', valueRouter)
app.use('/api/stationvalues', stationValueRouter)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()


module.exports = app