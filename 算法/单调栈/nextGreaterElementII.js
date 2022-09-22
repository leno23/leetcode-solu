/*
  503. 下一个更大元素 II

  给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），
  输出每个元素的下一个更大元素。数字 x 的下一个更大的元素是按数组遍历顺序，
  这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。
  如果不存在，则输出 -1。
*/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
 var nextGreaterElements = function (nums) {
  let s = [], ret = Array(nums.length).fill(-1)
  for (let i = 0; i < nums.length; i++) {
      while (s.length && nums[i] > nums[s[s.length - 1]]) {
          ret[s[s.length - 1]] = nums[i]
          s.pop()
      }
      s.push(i)
  }
  for (let i = 0; i < nums.length; i++) {
      while (s.length && nums[i] > nums[s[s.length - 1]]) {
          ret[s[s.length - 1]] = nums[i]
          s.pop()
      }
      s.push(i)
  }
  return ret
};