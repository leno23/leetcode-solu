/*
  456. 132 模式

  给你一个整数数组 nums ，数组中共有 n 个整数。132 模式的子序列 
  由三个整数 nums[i]、nums[j] 和 nums[k] 组成，
  并同时满足：i < j < k 和 nums[i] < nums[k] < nums[j] 。

  如果 nums 中存在 132 模式的子序列 ，返回 true ；否则，返回 false 。
*/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
 var find132pattern = function (nums) {
  let l = Array(nums.length)
  l[0] = Number.MAX_SAFE_INTEGER
  for (let i = 1; i < nums.length; i++) l[i] = Math.min(l[i - 1], nums[i - 1])
  let s = []
  for (let i = nums.length - 1; i >= 0; --i) {
      let val = nums[i]
      while (s.length && nums[i] > s[s.length - 1]) val = s[s.length-1], s.pop()
      s.push(nums[i])
      if (l[i] < nums[i] && val < nums[i] && val > l[i]) return true
  }
  return false
};