
// 队列
class Queue {
  constructor(size = 10) {
    this.head = 0; // 头指针
    this.tail = 0; // 尾指针
    this.arr = Array(size).fill() // 存储元素的数组
  }
  // 入队
  push(x) {
    if (this.full()) {
      console.error('Queue is Full')
      return
    }
    this.arr[this.tail] = x
    this.tail++
  }
  // 出队
  pop() {
    if (this.empty()) {
      console.error('Queue is Empty')
      return
    }
    this.head++
  }
  // 队列长度
  size() {
    return this.tail - this.head
  }
  // 队首元素
  front() {
    return this.arr[this.head]
  }
  // 判空
  empty() {
    return this.head === this.tail
  }
  // 判满
  full() {
    // return this.size() >= this.arr.length
    return this.tail >= this.arr.length
  }
  // 输出
  output() {
    var ret = []
    for (var i = this.head; i < this.tail; i++) {
      ret.push(this.arr[i])
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
q.pop();
q.output()
console.log(q)
q.push(3)  // 尾指针到尾部，不能再添加