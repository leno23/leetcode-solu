剑指 Offer II 008. 和大于等于 target 的最短子数组

给定一个含有 n 个正整数的数组和一个正整数 target 。

找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

 

示例 1：

输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。

```js
var minSubArrayLen = function (target, nums) {
    let res = Infinity, n = nums.length, l = 0, sum = 0
    // 滑动窗口（双指针）
    // 例如 2 3 1 2 4 3
    // 默认都位于0位置，sum记录窗口中数字的和值，此时为2
    // sum<target  需要进入更多数字，r++
    // r=3时，sum=8 >= 7满足，但是可能移除左边一些小值之后依然成立，
    // 所以尝试将左边元素踢出窗口，直到满足sum-nums[l] < target
    // 此时sum就是满足条件的最小值，然后更新区间距离
    for (let i = 0; i < n; i++) {
        sum += nums[i]
        if (sum >= target) {
            while (sum - nums[l] >= target) {
                sum -= nums[l]
                l++
            }
            if (sum >= target) res = Math.min(res, i - l + 1)
        }
    }
    return res == Infinity ? 0 : res
};