/*
1877. 数组中最大数对和的最小值

一个数对 (a,b) 的 数对和 等于 a + b 。最大数对和 是一个数对数组中最大的 数对和 。

比方说，如果我们有数对 (1,5) ，(2,3) 和 (4,4)，
最大数对和 为 max(1+5, 2+3, 4+4) = max(6, 5, 8) = 8 。
给你一个长度为 偶数 n 的数组 nums ，请你将 nums 中的元素分成 n / 2 个数对，使得：

nums 中每个元素 恰好 在 一个 数对中，且
最大数对和 的值 最小 。
请你在最优数对划分的方案下，返回最小的 最大数对和 。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var minPairSum = function (nums) {
  nums.sort((a, b) => b - a);
  let ans = 0;
  // 数对和即一对数的和，也就是 两个数字的和
  // 一个有偶数个数n的数组可以被划分成n/2个数对，最大的数对和当然是
  // 数组倒序排列之后前两个数的和
  // 比如 3 5 2 3 倒序排列之后为 5 3 3 2，最大的数对和为 5+3=8
  // 但是，这里题目需要求最小值，感觉这里牵扯到一些数学思维
  // 怎样从数组中划分数对，可以使得所有的这些数对的和的最大值在所有【划分的方法】中最小
  // 最终，可以想到一种方法，就是让数组中最大值和最小值配对，第二大值和第二小值配对，...
  // 这样可以保证配对出的数对的最大和最小
  // 例如 3 5 2 3  排序后为5 3 3 2，可以让5,2、3,3配对，这样所有数对和的最大值就会最小啦
  for (let i = 0; i < nums.length >> 1; i++) {
    ans = Math.max(nums[i] + nums[nums.length - i - 1], ans);
  }
  return ans;
};
