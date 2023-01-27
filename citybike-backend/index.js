const express = require('express')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const biketripsRouter = require('./controllers/biketrips')
const bikestationsRouter = require('./controllers/bikestations')
app.use(express.json())

app.use('/api/biketrips', biketripsRouter)
app.use('/api/bikestations', bikestationsRouter)

app.get('/', async (req, res) => {
  res.send('Starting a project')
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()