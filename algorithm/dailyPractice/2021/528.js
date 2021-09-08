/*
528. 按权重随机选择

给定一个正整数数组 w ，其中 w[i] 代表下标 i 的权重（下标从 0 开始），请写一个函数 pickIndex ，
它可以随机地获取下标 i，选取下标 i 的概率与 w[i] 成正比。

例如，对于 w = [1, 3]，挑选下标 0 的概率为 1 / (1 + 3) = 0.25 （即，25%），
而选取下标 1 的概率为 3 / (1 + 3) = 0.75（即，75%）。

也就是说，选取下标 i 的概率为 w[i] / sum(w) 。

*/
var Solution = function (w) {
    pre = new Array(w.length).fill(0);
    pre[0] = w[0];
    // 前缀和数组
    for (let i = 1; i < w.length; ++i) {
        pre[i] = pre[i - 1] + w[i];
    }
    // 区间总长度
    this.total = pre[pre.length - 1];
};

Solution.prototype.pickIndex = function () {
    const x = ((Math.random() * this.total) | 0) + 1;
    //      区间[1,2,3,4]
    //      -|--|----|----
    // 前缀和  [1,3,6,10]
    // 权重/下标  0  1   2
    // pickIndex即要求随机在长度为10的区间中生成一个数，然后返回这个数字所在区间的下标
    // 二分查找这个数所在区间的下标
    const binarySearch = (x) => {
        let low = 0,
            high = pre.length - 1;
        while (low < high) {
            const mid = ((high - low) >> 1) + low;
            if (pre[mid] < x) {
                low = mid + 1;
            } else high = mid;
        }
        return low;
    };
    return binarySearch(x);
};
