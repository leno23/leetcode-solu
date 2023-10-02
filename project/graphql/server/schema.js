const { GraphQLSchema, GraphQLNonNull, GraphQLList } = require('graphql')
const { GraphQLString } = require('graphql')
const { GraphQLObjectType } = require('graphql')

const { CategoryModel, ProductModel } = require('./model')

// const categories = [
//     { id: '1', name: '图书' },
//     { id: '2', name: '数码' },
//     { id: '3', name: '食品' },
// ]
// const products = [
//     { id: '1', name: '红楼梦', category: '1' },
//     { id: '2', name: '西游记', category: '1' },
//     { id: '3', name: '水浒传', category: '1' },
//     { id: '4', name: '面包', category: '3' },
//     { id: '5', name: 'iPhone', category: '2' },
// ]

const Category = new GraphQLObjectType({
    name: 'Category',
    fields: () => {
        return {
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            // 一个分类有多少个商品，类型为Product list
            products: {
                type: new GraphQLList(Product),
                resolve(parent) {
                    return ProductModel.find({ category: parent.id })
                    // return products.filter(item => item.category === parent.id)
                }
            }
        }
    }
})

const Product = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        // 商品所属的分类
        category: {
            type: Category,
            resolve(parent) {
                return CategoryModel.findById(parent.category)
                // return categories.find(item => item.id === parent.category)
            }
        }
    }
})

// 定义跟类型 query mutation
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getCategory: {
            type: Category,
            args: {
                // 没有传的话会报错提示
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return CategoryModel.findById(args.id)
                // return categories.find(item => item.id == args.id)
            }
        },
        getCategories: {
            type: new GraphQLList(Category),
            args: {},
            resolve(parent) {
                return CategoryModel.find()
                // return categories
            }
        },
        getProducts: {
            type: new GraphQLList(Product),
            args: {},
            resolve(parent) {
                return ProductModel.find()
                // return products
            }
        },
        getProduct: {
            type: new GraphQLList(Product),
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return ProductModel.find({ id: args.id })
                // return products.filter(item => item.id === args.id)
            }
        }
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addCategory: {
            type: Category,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return CategoryModel.create(args)
                // args.id = categories.length + 1
                // categories.push(args)
                // return args
            }
        },
        addProduct: {
            type: Product,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return ProductModel.create(args)
                // args.id = products.length + 1
                // products.push(args)
                // return args
            }
        }
    }
})
// 定义schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})