
// 循环队列
class Queue {
  // {size} 初始长度
  constructor(size = 10) {
    this.head = 0; // 头指针
    this.tail = 0; // 尾指针
    this.cnt = 0;   // 元素个数
    this.arr = Array(size).fill() // 存储元素的数组
  }
  // 入队
  push(x) {
    if (this.full()) {
      console.log('Queue is Full')
      return
    }

    if (this.tail === this.arr.length) {

      this.tail = 0
      this.arr[this.tail] = x
    } else {
      if (this.tail < this.head) {
        this.arr[++this.tail] = x
      } else {
        this.arr[this.tail++] = x
      }
    }
    this.cnt++
  }
  // 出队
  pop() {
    if (this.empty()) {
      console.error('Queue is Empty')
      return
    }
    this.head++
    this.cnt--
    if (this.head === this.arr.length) this.head = 0
  }
  // 队列长度
  size() {
    return this.cnt
  }
  // 队首元素
  front() {
    return this.arr[this.head]
  }
  // 判空
  empty() {
    return this.cnt === 0
  }
  // 判满
  full() {
    return this.cnt === this.arr.length
  }
  clear() {
    this.head = this.tail = this.cnt = 0
  }

  // 输出
  output() {
    console.log('q', this)
    var ret = []
    for (var i = 0, j = this.head; i < this.cnt; i++) {
      if (j === this.arr.length) {
        j = 0
        ret.push(this.arr[j++])
      } else {
        ret.push(this.arr[j++])
      }
    }
    console.log(ret)
  }
}

var q = new Queue(5)
console.log(q.empty());
q.push(5)
q.push(3)
q.output()
q.front()
console.log(q.full());

q.push(3)
q.push(2)
q.push(1)
q.output()
console.log(q.full());
q.pop()
q.output()
q.push(10)  // 可以循环添加
q.output()
q.pop()
q.output()
q.push(13)
q.output()