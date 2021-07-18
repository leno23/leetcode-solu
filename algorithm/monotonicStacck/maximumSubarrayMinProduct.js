/*
1856. 子数组最小乘积的最大值

一个数组的 最小乘积 定义为这个数组中 最小值 乘以 数组的 和 。

比方说，数组 [3,2,5] （最小值是 2）的最小乘积为 2 * (3+2+5) = 2 * 10 = 20 。
给你一个正整数数组 nums ，请你返回 nums 任意 非空子数组 的最小乘积 的 最大值 。
由于答案可能很大，请你返回答案对  109 + 7 取余 的结果。

请注意，最小乘积的最大值考虑的是取余操作 之前 的结果。题目保证最小乘积的最大值在 
不取余 的情况下可以用 64 位有符号整数 保存。

子数组 定义为一个数组的 连续 部分。


*/
/**
 * @param {number[]} nums
 * @return {number}
 */
 var maxSumMinProduct = function (nums) {
  let s = [], n = nums.length
  let l = [], r = []
  for (let i = 0; i < n; i++) l[i] = -1, r[i] = n
  for (let i = 0; i < n; i++) {
      while (s.length && nums[i] <= nums[s[s.length - 1]]) {
          r[s[s.length - 1]] = i
          s.pop()
      }
      if (s.length) l[i] = s[s.length - 1]
      s.push(i)
  }
  let sum = Array(n + 1)
  sum[0] = 0
  for (let i = 0; i < n; i++) {
      sum[i + 1] = sum[i] + nums[i]
  }
  let ans = BigInt(0)
  for (let i = 0; i < n; i++) {
      let n = BigInt(nums[i]) * BigInt(sum[r[i]] - sum[l[i] + 1])
      if (n > ans) {
          ans = n
      }
  }
  return ans % BigInt(1e9 + 7)
};