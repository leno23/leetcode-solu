剑指 Offer 09. 用两个栈实现队列

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

```javascript
var CQueue = function () {
    // 使用双栈，借助栈的性质实现数据从s1入从s2出，顺序保持一致
    this.s1 = [];
    this.s2 = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function (value) {
    this.s1.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function () {
    // s2栈负责吐数据，若存在数据，则弹出
    if (this.s2.length != 0) {
        return this.s2.pop();
    } else {
        // 不存在，则将s1数据重新灌入s2中
        while (this.s1.length) this.s2.push(this.s1.pop());

        return this.s2.length ? this.s2.pop() : -1;
    }
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```
