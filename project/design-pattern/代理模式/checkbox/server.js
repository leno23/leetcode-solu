const express = require('express')
let app = express()
let path = require('path')
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname))

let todos = [
  { id: 1, text: '吃饭', completed: false },
  { id: 2, text: '睡觉', completed: false },
  { id: 3, text: '打豆豆', completed: false }
]
app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/toggle', (req, res) => {
  let ids = req.body.ids
  let map = {}
  for (let todo of todos) map[todo.id] = todo
  ids.forEach((id) => {
    map[id].completed = !map[id].completed
  })
  res.json(todos)
})

app.listen(4000, () => {
  console.log(
    'server is running at http://localhost:4000'
  )
})
