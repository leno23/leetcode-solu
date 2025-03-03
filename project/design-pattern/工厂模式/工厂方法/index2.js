/*  工厂方法模式
 Factory Method 又称多态性工厂模式
 在工厂方法模式中，核心的工厂类不再负责所有产品的创建，而是将具体创建的工作交给子类来做
 */

const settings = require('./settings')

let apple = settings.apple.create()
console.log(apple?.flavour)
let orange = settings.orange.create()
console.log(orange?.flavour)
