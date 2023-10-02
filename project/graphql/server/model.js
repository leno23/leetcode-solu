let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId
const Schema = mongoose.Schema
// mongodb暂时使用3.0版本
const conn = mongoose.createConnection("mongodb://127.0.0.1/graphql")
conn.on('open', () => console.log("数据库连接成功"))
conn.on('error', (err) => console.log(err))
const CategorySchema = new Schema({
    name: String
})
const CategoryModel = conn.model('Category', CategorySchema)
const ProductSchema = new Schema({
    name: String,
    category: {
        type: ObjectId,
        ref: "Category"
    }
})
const ProductModel = conn.model('Product', ProductSchema)
module.exports = {
    CategoryModel,
    ProductModel
}