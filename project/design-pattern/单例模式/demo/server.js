let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
const path = require('path')
let app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  express.static(path.join(__dirname, 'public'))
)
app.post('/user', (req, res) => {
  let data = req.body
  console.log('接收到的参数', data)
  fs.writeFile(
    `./users/${data.id}.json`,
    JSON.stringify(data),
    (err, data) => {
      res.json({ message: 'success' })
      console.log(123, err)
    }
  )
})
app.get('/user/:id', (req, res) => {
  let { id } = req.params
  fs.readFile(
    `./users/${id}.json`,
    'utf8',
    (err, data) => {
      res.json(JSON.parse(data))
    }
  )
})
app.listen(3001, () => {
  console.log(
    'server is running at http://localhost:3001'
  )
})
