剑指 Offer II 010. 和为 k 的子数组

给定一个整数数组和一个整数 k ，请找到该数组中和为 k 的连续子数组的个数。

 

示例 1：

输入:nums = [1,1,1], k = 2
输出: 2
解释: 此题 [1,1] 与 [1,1] 为两种不同的情况
```js
var subarraySum = function (nums, k) {
    let pre = [0], n = nums.length
    // 前缀和数组
    for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i]
    // 记录当前位置之前出现过的 前缀和的次数
    let m = new Map, res = 0
    for (let i = 0; i <= n; i++) {
        // 可以和一个区间组成前缀和为pre[i]的前面的某个前缀和
        let t = pre[i] - k
        // 当前位置之前出现过一个前缀和t，使得t+k = pre[i]，那么就找到一个符合条件的区间
        if (m.has(t)) {
            // 符合条件的区间个数 = 前面出现的符合条件的前缀和的个数
            // 因为有负数，所以可能会出现多个相同的前缀和
            res += m.get(t)
        }
        // 当前位置的前缀和个数+1
        m.set(pre[i], (m.get(pre[i]) || 0) + 1)
    }
    return res
};
```