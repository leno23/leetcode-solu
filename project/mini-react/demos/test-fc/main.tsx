import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'


const App = () => {
  const [num] = useState(100)
  return (
    <div>
      {num}
      {/* <Child /> */}
    </div>
  )
}

const Child = () => {
  return <span>App -- big react</span>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
