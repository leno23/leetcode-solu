import { gql } from 'graphql-tag'
export const GET_PRODUCTS = gql`
query {
  getProducts{
    id
    name
    category{
      id
      name
      products{
        id
        name
      }
    }
  }
}`
export const CATEGORIES_PRODUCTS = gql`
query {
    getCategories {
      id
      name
      products {
        id
        name
      }
    }
    getProducts{
      id
      name
      category{
        id
        name
        products{
          id
          name
        }
      }
    }
  }
  
`

export const ADD_PRODUCT = gql`
mutation($name:String!,$categoryId:String!) {
  addProduct(name: $name, category: $categoryId) {
    id
    name
    category {
      id
      name
      products {
        id
        name
      }
    }
  }
}
`