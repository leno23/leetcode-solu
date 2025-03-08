const fs = require('fs')
const path = require('path')
const stream = fs.createReadStream(
  path.resolve(__dirname, './1.txt'),
  'utf-8'
)
stream.on('data', (chunk) => {
  console.log(chunk)
})
stream.on('end', () => {
  console.log('finished')
})
