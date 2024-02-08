import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// const jsx = (
//   <div>
//     <span>big react</span>
//   </div>
// )
const App = () => {
  const [num, setNum] = useState(111)
  window.setNum = setNum
  debugger
  return num == 3 ? <Child/> : <div>{num}</div>
}

const Child = () => {
  return <span>App -- big react</span>
}
const root = document.querySelector('#root')
ReactDOM.createRoot(root).render(App)
console.log(React, App, ReactDOM)
