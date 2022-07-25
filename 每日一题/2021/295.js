/*
295. 数据流的中位数

中位数是有序列表中间的数。如果列表长度是偶数，中位数则是中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

void addNum(int num) - 从数据流中添加一个整数到数据结构中。
double findMedian() - 返回目前所有元素的中位数。
示例：

*/
/*
295. 数据流的中位数

*/
class Heap {
    constructor(fn) {
        this.data = [];
        this.cnt = 0;
        this.fn = fn;
    }
    compare(a, b) {
        return this.fn(this.data[a], this.data[b]) > 0;
    }
    push(i) {
        let ind = this.cnt;
        this.data[this.cnt++] = i;
        while (ind && this.compare(((ind - 1) / 2) | 0, ind)) {
            this.swap(ind, ((ind - 1) / 2) | 0);
            ind = ((ind - 1) / 2) | 0;
        }
    }
    pop() {
        const top = this.data[0];
        this.data[0] = this.data[--this.cnt];
        this.data.length = this.cnt;
        let n = this.cnt - 1,
            ind = 0,
            tmp = ind;
        while (ind * 2 + 1 <= n) {
            if (this.compare(ind, ind * 2 + 1)) tmp = ind * 2 + 1;
            if (ind * 2 + 2 <= n && this.compare(tmp, ind * 2 + 2))
                tmp = ind * 2 + 2;
            if (ind == tmp) break;
            this.swap(ind, tmp);
            ind = tmp;
        }
        return top;
    }
    swap(a, b) {
        [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
    }
    top() {
        return this.data[0] | 0;
    }
    size() {
        return this.data.length;
    }
}
/**
 * initialize your data structure here.
 */
var MedianFinder = function () {
    this.greater = new Heap((a, b) => b - a);
    this.less = new Heap((a, b) => a - b);
};

/**
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function (num) {
    const greater = this.greater;
    const less = this.less;
    // 大数放在小顶堆，小数放到大顶堆
    // push过程保证大顶堆堆顶数字大于小顶堆堆顶数字，而且数量相差不超过1
    if (num <= greater.top()) greater.push(num);
    else less.push(num);

    // 大数不能比小数多
    if (less.size() > greater.size()) greater.push(less.pop());

    // 小数不能比大数多2个
    if (greater.size() > less.size() + 1) less.push(greater.pop());
    
    return;
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function () {
    const n = this.greater.size() + this.less.size();
    if (n % 2 == 1) {
        // 列表长度为奇数，中位数为大顶堆的堆顶
        return this.greater.top();
    }
    return (this.greater.top() + this.less.top()) / 2;
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
