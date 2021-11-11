剑指 Offer 40. 最小的 k 个数

输入整数数组 arr ，找出其中最小的 k 个数。例如，输入 4、5、1、6、2、7、3、8 这 8 个数字，则最小的 4 个数字是 1、2、3、4。

示例 1：

输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]

```js
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
class Heap {
    constructor() {
        this.data = [];
        this.cnt = [];
    }
    push(x) {
        let ind = this.cnt;
        this.data[this.cnt++] = x;
        while (ind && this.data[(ind - 1) >> 1] > this.data[ind]) {
            this.swap((ind - 1) >> 1, ind);
            ind = (ind - 1) >> 1;
        }
    }
    pop() {
        if (this.cnt == 0) return;
        let top = this.top();
        this.data[0] = this.data[--this.cnt];
        let n = this.cnt - 1,
            ind = 0,
            tmp = ind;
        while (ind * 2 + 1 <= n) {
            if (this.data[ind] > this.data[ind * 2 + 1]) tmp = ind * 2 + 1;
            if (ind * 2 + 2 <= n && this.data[tmp] > this.data[ind * 2 + 2])
                tmp = ind * 2 + 2;
            if (tmp == ind) break;
            this.swap(ind, tmp);
            ind = tmp;
        }
        return top;
    }
    swap(a, b) {
        [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
    }
    top() {
        return this.data[0];
    }
}
var getLeastNumbers = function (arr, k) {
    let q = new MinPriorityQueue();
    for (let x of arr) q.enqueue(x);
    let ret = [];
    while (k--) ret.push(q.dequeue().element);
    return ret;

    // 使用自己实现的heap
    // let h = new Heap()
    // let ret = []
    // for(let x of arr) h.push(x)
    // while(k--) ret.push(h.pop())
    // return ret
};
```
