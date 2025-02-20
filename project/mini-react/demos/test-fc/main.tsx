import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

const App1 = () => {
  const [num, setNum] = useState(101)
  // window.setNum = setNum
  const arr = num % 2 ? [
    <li key='3'>3</li>,
    <li key='2'>2</li>,
    <li key='1'>1</li>
  ] : [
    <li key='1'>1</li>,
    <li key='2'>2</li>,
    <li key='3'>3</li>
  ]
  return <ul onClickCapture={() => {
    setNum(num + 1)
  }}>{arr}</ul>
}

const App2 = () => {
  return <>
    <div></div>
    <div></div>
  </>
}
const App3 = () => {
  return <ul>
    <>
      <li>1</li>
      <li>2</li>
    </>
    <li>3</li>
    <li>4</li>
  </ul>
}

const App4 = () => {
  const [num, setNum] = useState(101)
  const arr = num % 2 ? [
    <li key='3'>3</li>,
    <li key='2'>2</li>,
    <li key='1'>1</li>
  ] : [
    <li key='1'>1</li>,
    <li key='2'>2</li>,
    <li key='3'>3</li>
  ]
  return <ul onClickCapture={() => {
    setNum(num + 1)
  }}>
    {arr}
    <li>4</li>
    <li>5</li>
  </ul>
}
// 测试异步更新
const App5 = () => {
  const [num, setNum] = useState(101)

  return <ul onClickCapture={() => {

    setNum(num => num + 1)
    setNum(num => num + 1)
    setNum(num => num + 1)
  }}>
    {num}
  </ul>
}
// 测试useEffect
const App6 = () => {
  const [num, setNum] = useState(0)
  useEffect(() => {
    console.log('app mount')
    return () => {
      console.log('app unmount')
    }
  }, [])

  useEffect(() => {
    console.log('num change create', num)
    return () => {
      console.log('num change destory', num)
    }
  }, [num])
  return <div onClick={() => {
    setNum(num + 1)
  }}>
    {num === 0 ? <Child /> : 'noop'}
  </div>
}


const Child = () => {
  useEffect(() => {
    console.log('child mount')
    return () => {
      console.log('child unmount')
    }
  }, [])
  return <span>App -- big react</span>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App6 />
)