// @ts-check
const express = require('express')
const cors = require('cors')
require('./db')

const bindRoutes = require('./routes')
const app = express()
app.use(express.json())
app.use(cors())
bindRoutes(app)

app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    return res.status(err.status || err.statusCode || err.code || 400).send(err)
  }
  next()
})

app.listen(3000, () => {
  console.log('Server is listen on port 3000.')
})
