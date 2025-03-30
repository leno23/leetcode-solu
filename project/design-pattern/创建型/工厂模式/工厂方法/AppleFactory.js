const Plant = require('./Plant')
const Factory = require('./Factory')

class Apple extends Plant {
  flavour
  constructor(name, flavour) {
    super(name)
    this.flavour = flavour
  }
}
module.exports = class AppleFactory extends (
  Factory
) {
  constructor() {}
  static create() {
    return new Apple('apple', '甜')
  }
}
