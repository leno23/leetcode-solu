import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import ApolloClient, { gql } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' })
client.query({
    query: gql`
        query{
            getCategories{
                id,
                name
            }
        }
    `
}).then(res => {
    console.log(res);
})
ReactDOM.render(<ApolloProvider client={client}>
    <App />
</ApolloProvider>, document.getElementById('root'))