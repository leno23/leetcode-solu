const express = require('express')
const app = express()
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')

app.use(cors({
    orign: 'http://localhost:3000',  // 允许那个客户端跨域访问
    methods: 'GET,PUT,POST,DELETE,OPTIONS'
}))
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true //查询工具
}))


app.listen(4000, () => {
    console.log('服务器在4000端口启动');
})