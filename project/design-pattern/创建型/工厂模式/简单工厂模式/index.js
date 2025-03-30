/*  简单工厂模式
 有一个工厂决定创建哪个产品类的实例
 简单工厂只依赖一个工厂，否则对每个对象都耦合

 */

// 提供方代码
class Plant {
  name
  constructor(name) {
    this.name = name
  }
}
class Apple extends Plant {
  flavour
  constructor(name, flavour) {
    super(name)
    this.flavour = flavour
  }
}

class Orange extends Plant {
  flavour
  constructor(name, flavour) {
    super(name)
    this.flavour = flavour
  }
}

class Factory {
  constructor() {}
  static create(type) {
    switch (type) {
      case 'apple':
        return new Apple('apple', '甜')
      case 'orange':
        return new Orange('orange', '酸')
    }
  }
}

// 调用方代码  只需要根据类型调用工厂方法即可，不需要关心具体的实现
let apple = Factory.create('apple')
console.log(apple?.flavour)

let orange = Factory.create('orange')
console.log(orange?.flavour)
