import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'


const App = () => {
  const [num, setNum] = useState(100)
  // window.setNum = setNum
  return <div  onClick={() => {
    setNum(num + 1)
  }}>{num}</div>
}

const Child = () => {
  return <span>App -- big react</span>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)