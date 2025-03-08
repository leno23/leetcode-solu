/*
该模式就是把一些复杂的流程封装成一个接口供给外部用户更简单的使用
- 门面角色：外观模式的核心，它被客户角色调用，它熟悉子系统的功能。内部根据客户角色的需求预定了几种功能的组合。
- 子系统角色： 实现了子系统的功能。它对客户角色和Facade是未知的。它接受Facade传递过来的命令。
- 客户角色： 通过调用Faced来完成要实现的功能

*/
class Sum {
  sum(a, b) {
    return a + b
  }
}
class Minus {
  minus(a, b) {
    return a - b
  }
}
class Multiply {
  multiply(a, b) {
    return a * b
  }
}
class Divide {
  divide(a, b) {
    return a / b
  }
}

class Calc {
  constructor() {
    this.sumObj = new Sum()
    this.minusObj = new Minus()
    this.multiplyObj = new Multiply()
    this.divideObj = new Divide()
  }
  sum(a, b) {
    return this.sumObj.sum(a, b)
  }
  minus(a, b) {
    return this.minusObj.minus(a, b)
  }
  multiply(a, b) {
    return this.multiplyObj.multiply(a, b)
  }
  divide(a, b) {
    return this.divideObj.divide(a, b)
  }
}
let calc = new Calc()
console.log(calc.sum(1, 2))
console.log(calc.minus(1, 2))
console.log(calc.multiply(1, 2))
console.log(calc.divide(1, 2))
