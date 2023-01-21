require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', async (req, res) => {
  res.send('Starting a project')
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
