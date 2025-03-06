// 全局只有一个实例
class Window {
  constructor() {
    this.name = 'Window'
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Window()
    }
    return this.instance
  }
}
let win1 = Window.getInstance()
let win2 = Window.getInstance()
console.log(win1 === win2) // true
