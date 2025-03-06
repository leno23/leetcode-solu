/*
在软件行业，AOP为Oriented Programming的缩写，意为：面向切面编程
可以通过预编译方式和运行期动态代理实现在不修改代码的情况下给程序动态添加功能的一种技术

*/

function addBefore(fn, beforefn) {
  return () => {
    beforefn.apply(this, arguments)
    return fn.apply(this, arguments)
  }
}
function addAfter(fn, afterfn) {
  return () => {
    var ret = fn.apply(this, arguments)
    afterfn.apply(this, arguments)
    return ret
  }
}
function buy() {
  console.log('buy')
}
buy = addBefore(buy, () => {
  console.log('before buy')
})
buy = after(buy, () => {
  console.log('after buy')
})
buy()
