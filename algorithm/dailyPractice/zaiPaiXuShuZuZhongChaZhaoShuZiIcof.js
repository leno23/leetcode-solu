/*
  剑指 Offer 53 - I. 在排序数组中查找数字 I

  统计一个数字在排序数组中出现的次数
*/


/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
 var search = function (nums, target) {
  let left = 0, right = nums.length - 1
  // 二分查找模板
  while (left <= right) {
      let mid = (left + right) >> 1
      if (nums[mid] >= target) {
          right = mid - 1
      } else {
          left = mid + 1
      }
  }
  let cnt = 0
  // 从left往后查找值为target的个数
  while (nums[left++] == target) cnt++
  return cnt
};