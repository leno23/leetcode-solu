/*
502. IPO

假设 力扣（LeetCode）即将开始 IPO 。为了以更高的价格将股票卖给风险投资公司，
力扣 希望在 IPO 之前开展一些项目以增加其资本。 由于资源有限，它只能在 IPO 之前完成最多 k 个不同的项目。
帮助 力扣 设计完成最多 k 个不同项目后得到最大总资本的方式。

给你 n 个项目。对于每个项目 i ，它都有一个纯利润 profits[i] ，和启动该项目需要的最小资本 capital[i] 。

最初，你的资本为 w 。当你完成一个项目时，你将获得纯利润，且利润将被添加到你的总资本中。

总而言之，从给定项目中选择 最多 k 个不同项目的列表，以 最大化最终资本 ，并输出最终可获得的最多资本。

答案保证在 32 位有符号整数范围内。

*/
/**
 * @param {number} k
 * @param {number} w
 * @param {number[]} profits
 * @param {number[]} capital
 * @return {number}
 */
// 优先队列模板
class Heap {
    constructor(compare) {
        this.data = [];
        this.cnt = 0;
        this.comp = compare;
    }
    compare(a, b) {
        return this.comp(this.data[a], this.data[b]) < 0;
    }
    push(x) {
        let ind = this.cnt;
        this.data[this.cnt++] = x;
        while (ind && this.compare((ind - 1) >> 1, ind)) {
            this.swap((ind - 1) >> 1, ind);
            ind = (ind - 1) >> 1;
        }
    }
    pop() {
        if (this.cnt == 0) return;
        let top = this.data[0];
        this.data[0] = this.data[--this.cnt];
        this.data.length = this.cnt;
        let n = this.cnt - 1,
            ind = 0,
            tmp = ind;
        while (2 * ind + 1 <= n) {
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
    size() {
        return this.cnt;
    }
    top() {
        return this.data[0];
    }
}
var findMaximizedCapital = function (k, w, profits, capital) {
    const n = profits.length;
    const arr = new Array(n);
    // 将资本、利润按项目号组合   [资本,纯利润]
    for (let i = 0; i < n; i++) {
        arr[i] = [capital[i], profits[i]];
    }
    // 将项目按所需资本从小到大排序
    arr.sort((a, b) => a[0] - b[0]);

    // 创建最大堆
    const maxHeap = new Heap((a, b) => a - b);
    let cur = 0;
    for (let i = 0; i < k; i++) {
        while (cur < n && arr[cur][0] <= w) {
            // 将所有满足条件的项目所获得的利润插入堆中
            maxHeap.push(arr[cur++][1]);
        }
        if (maxHeap.size()) {
            // 堆不为空
            // 取出堆顶，即为最大的纯利润，更新自己的资本
            w += maxHeap.pop();
        } else {
            // 堆为空，直接退出循环
            // 因为已经没有满足条件的项目进入堆了
            break;
        }
    }
    return w;
};
