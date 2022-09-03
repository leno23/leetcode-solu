剑指 Offer II 011. 0 和 1 个数相同的子数组
给定一个二进制数组 nums , 找到含有相同数量的 0 和 1 的最长连续子数组，并返回该子数组的长度。

 

示例 1：

输入: nums = [0,1]
输出: 2
说明: [0, 1] 是具有相同数量 0 和 1 的最长连续子数组。
```js
// 与10题类似，可以将0变成-1，则题目就转化为求区间和为0的子数组的最大长度
// 使用哈希表记录一个前缀和第一次出现的位置
var findMaxLength = function (nums) {
    let pre = [0], n = nums.length
    for (let i = 0; i < n; i++) {
        pre[i + 1] = pre[i] + (nums[i] ? 1 : -1)
    }
    // 记录一个前缀和第一次出现的位置
    let m = new Map, res = 0
    for (let i = 0; i <= n; i++) {
        let t = pre[i]
        if (m.has(t)) {
            res = Math.max(res, i - m.get(t))
        } else {
            m.set(pre[i], i)
        }
    }
    return res
};
```