剑指 Offer II 009. 乘积小于 K 的子数组

给定一个正整数数组 nums和整数 k ，请找出该数组内乘积小于 k 的连续的子数组的个数。

 

示例 1:

输入: nums = [10,5,2,6], k = 100
输出: 8
解释: 8 个乘积小于 100 的子数组分别为: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6]。
需要注意的是 [10,5,2] 并不是乘积小于100的子数组。
```js
var numSubarrayProductLessThanK = function (nums, k) {
    // 因为需要连续子数组的乘积小于k，而正整数的乘积最小是1，那么如果k<=1，则无解
    if (k <= 1) return 0
    // 借助滑动窗口，枚举右边界，维护窗口中元素的乘积，始终保持乘积小于k，
    // 那么，窗口中以右边界为结尾，以每个元素做开头，有r-l+1个元素满足条件
    let res = 0, sum = 1, l = 0, n = nums.length
    for (let i = 0; i < n; i++) {
        sum *= nums[i]
        while (sum >= k) sum /= nums[l], l++
        res += i - l + 1
    }
    return res
};
```