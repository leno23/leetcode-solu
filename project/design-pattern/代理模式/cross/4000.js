const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname))
let users = []
let ind = 1
app.post('/register', (req, res) => {
  let { target, callback, username, password } =
    req.body
  let user = { username, password }
  let id = ind++
  user.id = id
  users.push(user)
  res.status(302)
  res.set(
    'Location',
    `${target}?callback=${callback}&args=${id}`
  )
  res.end()
})
app.listen(4000, () => {
  console.log(
    'server is running at http://localhost:4000'
  )
})
