// let StateMachine = require('javascript-state-machine')

class StateMachine {
  constructor({ init, transitions, methods }) {
    let map = {}
    Object.entries(methods).forEach(
      ([key, val]) => {
        this[key] = val
      }
    )
    let names = []
    for (let { from, to, name } of transitions) {
      let func = `on${
        name[0].toUpperCase() + name.slice(1)
      }`
      map[from] = [to, name, func]
      names.push(name)
    }
    for (let name of names) {
      let func = `on${
        name[0].toUpperCase() + name.slice(1)
      }`
      this[name] = () => {
        let check = map[this.from][1] === name
        if (!check) {
          return
        }
        this[func]()
        this.from = map[this.from][0]
      }
    }
    this.from = init
  }
}
let fsm = new StateMachine({
  init: 'solid',
  transitions: [
    { from: 'solid', to: 'liquid', name: 'melt' },
    {
      from: 'liquid',
      to: 'solid',
      name: 'freeze'
    },
    {
      from: 'liquid',
      to: 'gas',
      name: 'vaporize'
    },
    {
      from: 'gas',
      to: 'liquid',
      name: 'condense'
    }
  ],
  methods: {
    onMelt() {
      console.log('onMelt')
    },
    onFreeze() {
      console.log('onFreeze')
    },
    onVaporize() {
      console.log('onVaporize')
    },
    onCondense() {
      console.log('onCondense')
    }
  }
})

fsm.freeze()
fsm.melt()
