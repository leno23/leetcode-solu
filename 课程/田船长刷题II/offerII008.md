剑指 Offer II 008. 和大于等于 target 的最短子数组

给定一个含有 n 个正整数的数组和一个正整数 target 。

找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

 

示例 1：

输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。

```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
    let l = 0, now = 0, ans = Infinity
    for (let i = 0; i < nums.length; i++) {
        now += nums[i]
        while (l < i && now - nums[l] >= target) {
            now -= nums[l], l++
        }
        if (now >= target) ans = Math.min(ans, i - l + 1)
    }
    if (ans == Infinity) return 0
    return ans
};