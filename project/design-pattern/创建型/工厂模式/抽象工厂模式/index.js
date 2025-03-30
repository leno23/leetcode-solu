class Factory {
  createButton() {}
  createIcon() {}
}

class Icon {}
class Button {}
class AppleIcon {
  constructor() {}
  render() {
    console.log('AppleIcon render')
  }
}
class WindowIcon {
  constructor() {}
  render() {
    console.log('WindowIcon render')
  }
}
class AppleButton {
  constructor() {}
  render() {
    console.log('AppleButton render')
  }
}
class WindowButton {
  constructor() {}
  render() {
    console.log('WindowButton render')
  }
}

class AppleFactory extends Factory {
  createButton() {
    return new AppleButton()
  }
  createIcon() {
    return new AppleIcon()
  }
}
class WindowFactory extends Factory {
  createButton() {
    return new WindowButton()
  }
  createIcon() {
    return new WindowIcon()
  }
}

let windowFactory = new WindowFactory()
windowFactory.createButton().render()
windowFactory.createIcon().render()

// ----------------

let appleFactory = new AppleFactory()
appleFactory.createButton().render()
appleFactory.createIcon().render()

/**
 * 1.简单工厂   一般是一个函数返回产品的实例
 * 2.工厂方法  多了工厂类，通过创建不同的工厂类来创建不同的产品
 * 3.抽象工厂  一个工厂可以创建多种类似的产品
 *
 */
