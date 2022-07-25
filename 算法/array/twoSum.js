/*
1. 两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
你可以按任意顺序返回答案。
*/
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = {} // 记录遍历过的数字，value是与target之差
  for (let i = 0; i < nums.length; i++)
    if (map[nums[i]] == undefined) {
      // 记录可以和当前数字之和等于target的数字，和下标
      map[target - nums[i]] = i
    } else {
      // 找到目标值，并返回
      return [i, map[nums[i]]]
    }
};