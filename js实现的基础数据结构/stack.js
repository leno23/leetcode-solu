class Stack {
  constructor() {
    // 有一片连续的存储区
    this.data = []
    // 栈顶指针
    this.top = -1
  }
  push(x) {
    this.top++
    this.data[this.top] = x
  }
  pop() {
    if (this.empty()) return
    this.top--
  }
  size() {
    return this.top + 1
  }
  empty() {
    return this.top == -1
  }
  output() {
    let str = ''
    for (let i = 0; i <= this.top; i++) {
      str += this.data[i] + ' '
    }
    console.log(str)
  }
}
let arr = new Stack()
arr.push(1)
arr.push(2)
arr.push(3)
arr.pop()
arr.output()
arr.push(4)
arr.output()