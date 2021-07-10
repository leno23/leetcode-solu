/*
  164. 最大间距

  给定一个无序的数组，找出数组在排序之后，相邻元素之间最大的差值。

  如果数组元素个数小于 2，则返回 0。

  示例 1:
  输入: [3,6,9,1]
  输出: 3
  解释: 排序后的数组是 [1,3,6,9], 其中相邻元素 (3,6) 和 (6,9) 之间都存在最大差值 3。
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumGap = function (nums) {
  // 由于时间复杂度要求O(n)，故这里使用基数排序
  // 方法介绍在radix-sort.js
  let cnt = Array(65536).fill(0)
  let ret = Array(nums.length)
  for (let x of nums) cnt[x % 65536]++
  for (let i = 1; i < 65536; i++) cnt[i] += cnt[i - 1]
  for (let i = nums.length - 1; i >= 0; i--) ret[--cnt[nums[i] % 65536]] = nums[i]
  cnt.fill(0)
  for (let x of ret) cnt[x / 65536 | 0]++
  for (let i = 1; i < 65536; i++) cnt[i] += cnt[i - 1]
  for (let i = ret.length - 1; i >= 0; i--) nums[--cnt[ret[i] / 65536 | 0]] = ret[i]
  // 排序之后，遍历求出相邻数字的最大间距
  let ans = 0
  for (let i = 1; i < nums.length; i++) {
    ans = Math.max(ans, nums[i] - nums[i - 1])
  }
  return ans

};