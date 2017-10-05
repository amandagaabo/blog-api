const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()
const blogpostRouter = require('./blogpostRouter')

// log the http layer
app.use(morgan('common'))

// load static resources - js and css files
app.use(express.static('public'))

// for base url load index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

// routes for url endpoint
app.use('/blogposts', blogpostRouter)

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
})
