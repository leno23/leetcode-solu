import React from 'react'
import ReactDOM from 'react-dom'

// const jsx = (
//   <div>
//     <span>big react</span>
//   </div>
// )
const App = () => {
  return (
    <div>
      <Child />
    </div>
  )
}

const Child = () => {
  return <span>App -- big react</span>
}
const root = document.querySelector('#root')
ReactDOM.createRoot(root).render(App)
console.log(React, App, ReactDOM)
