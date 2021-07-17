/*
  155. 最小栈

  设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
  push(x) —— 将元素 x 推入栈中。
  pop() —— 删除栈顶的元素。
  top() —— 获取栈顶元素。
  getMin() —— 检索栈中的最小元素。
*/

/**
 * initialize your data structure here.
 */
//  模拟一个栈
class Stack {
  constructor() {
      this.data = []
  }
  push(x) {
      this.data.push(x)
  }
  pop() {
      this.data.pop()
  }
  isEmpty() {
      return this.size() == 0
  }
  size() {
      return this.data.length
  }
  top() {
      return this.data[this.size() - 1]
  }
}
var MinStack = function () {
  // 数据存储
  this.data = new Stack()
  // 在元素puh过程记录原数组中最小值的栈
  this.min = new Stack()
};

/** 
* @param {number} val
* @return {void}
*/
MinStack.prototype.push = function (val) {
  this.data.push(val)
  // 在push过程中更新最小栈中的最值
  if (this.min.isEmpty() || this.min.top() >= val) this.min.push(val);
};

/**
* @return {void}
*/
MinStack.prototype.pop = function () {
  // 若最小数被pop，同时最小栈也进行弹出
  if (this.data.top() == this.min.top()) this.min.pop()
  this.data.pop()
};

/**
* @return {number}
*/
MinStack.prototype.top = function () {
  return this.data.top()
};

/**
* @return {number}
*/
MinStack.prototype.getMin = function () {
  // 最小值记录在最小栈的栈顶
  return this.min.top()
};

/**
* Your MinStack object will be instantiated and called as such:
* var obj = new MinStack()
* obj.push(val)
* obj.pop()
* var param_3 = obj.top()
* var param_4 = obj.getMin()
*/