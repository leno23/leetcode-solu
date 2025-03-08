const express = require('express')
const app = express()
app.use(express.static(__dirname))
app.listen(3002, () => {
  console.log(
    'server is running at http://localhost:3002'
  )
})
