/**
 *  在不改变其原有的结构和功能为对象添加新功能
// 装饰比继承更加灵活

## 包装器
装饰器模式是将一个对象嵌入到另外一个对象之中，实际上相当于这个对象被另一个对象包装起来，形成一条包装链
请求随着这条链条依次传递到所有的对象，每个对象有处理这个请求的机会
*/

class Coffee {
  make(water) {
    return `${water}+咖啡`
  }
  cost() {
    return 10
  }
}
class MilkCoffee {
  constructor(coffee) {
    this.coffee = coffee
  }
  make(water) {
    return `${this.coffee.make(water)}+牛奶`
  }
  cost() {
    return this.coffee.cost() + 5
  }
}
class SugarCoffee {
  constructor(coffee) {
    this.coffee = coffee
  }
  make(water) {
    return `${this.coffee.make(water)}+糖`
  }
  cost() {
    return this.coffee.cost() + 2
  }
}
let coffee = new Coffee()
console.log(coffee.make('水'))

let milkCoffee = new MilkCoffee(coffee)
console.log(milkCoffee.make('水'))

let sugarCoffee = new SugarCoffee(milkCoffee)
console.log(sugarCoffee.make('水'))
