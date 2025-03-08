/*
被观察者提供维护观察者的一系列方法
观察者提供更新的方法
观察者把自己注册到被观察者中
在被观察者发生变化的时候，调用观察者的更新方法
      关注
用户  -->   微信公众号 
观察者       被观察者
              subs订阅者数组
              notify
*/

class Promise {
  constructor(executor) {
    this.fullfilled = []
    this.failed = []
    this.succRes = null
    // 给执行器注册一个回调函数，异步操作完成后调用
    executor((data) => {
      this.succRes = data
      this.fullfilled.forEach((fn) => {
        this.succRes = fn(this.succRes)
      })
    }, err => {
        this.failed.forEach(f=>f(err))
    })
  }
  then(fn) {
    this.fullfilled.push(fn)
    return this
  }
  catch(){
    this.failed.push(fn)
  }
}

new Promise((resolve) => {
  setTimeout(() => {
    resolve(222)
  }, 1000)
})
  .then((data) => {
    console.log(data)
    return 12
  })
  .then((data) => {
    console.log(data)
  })
  .catch((err)=>{
    console.log(err)
  })