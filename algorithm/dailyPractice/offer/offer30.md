剑指 Offer 30. 包含 min 函数的栈

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

```javascript
/**
 * initialize your data structure here.
 */
var MinStack = function () {
    // 存放真实数据的栈
    this.data = [];
    // 每push一个数据之后，将最小数入栈
    this.min_s = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
    this.data.push(x);
    if (this.min_s.length == 0) {
        // 第一个数直接添加
        this.min_s.push(x);
    } else {
        // 每次放入最小栈栈顶与x之间的小数
        this.min_s.push(Math.min(x, this.min_s[this.min_s.length - 1]));
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    // 两个栈同时弹出数据
    this.min_s.pop();
    this.data.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.data[this.data.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.min = function () {
    return this.min_s[this.min_s.length - 1];
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.min()
 */
```
