剑指 Offer 42. 连续子数组的最大和

输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为 O(n)。

示例 1:

输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    let n = nums.length,
        dp = Array(n).fill(0);
    dp[0] = nums[0];
    // dp[i]以第i项结尾的子数组的和的最大值(简称最大值)
    // 以第i项结尾很关键，因为这时dp[i]的值一定是nums[i-1]和另外一个数的和，
    // 而另外一个数就是数组前i-1项的dp[i-1],由于子数组需要为连续的
    // 那么dp[i]需要在dp[i-1]+nums[i]和nums[i]取最大值
    for (let i = 1; i < n; i++) dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    // 最终的结果就是，以数组每一项结尾的子数组的最大值，即为整个数组的最大值
    return Math.max(...dp);
};
```
