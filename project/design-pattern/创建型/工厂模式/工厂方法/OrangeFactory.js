const Plant = require('./Plant')
const Factory = require('./Factory')

class Orange extends Plant {
  flavour
  constructor(name, flavour) {
    super(name)
    this.flavour = flavour
  }
}
module.exports = class OrangeFactory extends (
  Factory
) {
  constructor() {}
  static create() {
    return new Orange('orange', '酸')
  }
}
