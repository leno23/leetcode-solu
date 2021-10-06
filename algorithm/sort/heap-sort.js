/**
 * 堆排序
 */

// 大顶堆 父节点大于子节点;小顶堆 父节点小于子节点;
// 使用数组实现优先队列
class Heap {
    constructor() {
        this.data = [];
        this.cnt = 0;
    }
    // 向上调整
    push(x) {
        let ind = this.cnt;
        this.data[this.cnt++] = x;
        // 父节点下标 (ind - 1) >>1
        while (ind !== 0 && this.data[(ind - 1) >> 1] < this.data[ind]) {
            [this.data[ind], this.data[(ind - 1) >> 1]] = [
                this.data[(ind - 1) >> 1],
                this.data[ind],
            ];
            // 继续向上调整
            ind = (ind - 1) >> 1;
        }
        return;
    }
    // 弹出根节点，向下调整
    pop() {
        // 没有元素，不能弹出
        if (this.size() == 0) return;
        let top = this.data[0];
        // 将末尾节点提升到第一位，并将heap长度减少一位
        this.data[0] = this.data[--this.cnt];
        let ind = 0,
            n = this.cnt - 1; // 最大子节点的下标
        // 当前节点有子节点
        while (ind * 2 + 1 <= n) {
            // 三元组的最大值下标，即父节点，默认给根节点
            let tmp = ind;
            // 比左子树小，更新父节点下标
            if (this.data[tmp] < this.data[ind * 2 + 1]) tmp = ind * 2 + 1;
            // 如果有右子树，而且值小于右子树
            if (ind * 2 + 2 <= n && this.data[tmp] < this.data[ind * 2 + 2])
                tmp = ind * 2 + 2;
            // 如果最大值是当前节点的值，不需要交换
            if (tmp == ind) break;
            // 交换位置
            [this.data[ind], this.data[tmp]] = [this.data[tmp], this.data[ind]];
            // 继续向下调整
            ind = tmp;
        }
        return top;
    }
    top() {
        return this.data[0];
    }
    size() {
        return this.cnt;
    }
    output() {
        let ret = [];
        for (var i = 0; i < this.cnt; i++) {
            ret.push(this.data[i]);
        }
    }
}
function heapSort(arr) {
    let heap = new Heap();
    let ret = [];
    for (const ele of arr) {
        heap.push(ele);
    }
    let len = arr.length;
    while (len--) ret.push(heap.pop());
    return ret;
}

let list = new Heap();
let arr = [12, 11, 10, 6, 7, 9, 3, 4, 5, 2, 88];
console.log(heapSort(arr));
