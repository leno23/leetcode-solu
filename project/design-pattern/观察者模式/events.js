class Mitt {
  constructor() {
    this.cbs = {}
  }
  on(key, cb) {
    if (!this.cbs[key]) {
      this.cbs[key] = new Set([cb])
      return
    }
    this.cbs[key].add(cb)
  }
  off(key, cb) {
    if (!this.cbs[key]) {
      return
    }
    this.cbs[key].delete(cb)
  }
  emit(key) {
    if (!this.cbs[key]) {
      return
    }
    this.cbs[key].forEach((f) => f())
  }
}

let event = new Mitt()
const click1 = () => {
  console.log('click1')
}
event.on('click', click1)
event.on('click', () => {
  console.log('click2')
})
event.emit('click')
event.off('click', click1)
event.emit('click')
