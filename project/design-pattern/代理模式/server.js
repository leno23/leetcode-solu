const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  express.static(path.join(__dirname, 'public'))
)
app.get('/loading', (req, res) => {
  res.sendFile(
    path.join(__dirname, './image/loading.gif')
  )
})
app.get('/image/:name', (req, res) => {
  setTimeout(() => {
    res.sendFile(
      path.resolve(__dirname, '.' + req.path)
    )
  }, 500)
})
app.listen(4000, () => {
  console.log(
    'server is running at http://localhost:4000'
  )
})
