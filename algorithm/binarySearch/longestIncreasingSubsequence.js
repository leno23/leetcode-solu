/*
300. 最长递增子序列

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
    let ret = [nums[0]]  // 递增子数组
    // 贪心，将比较大的数字push进去
    for (let i = 0; i < nums.length; i++) {
        if (ret[ret.length - 1] < nums[i]) {
            ret.push(nums[i])
        } else {
          // 二分法从ret中找到第一个第一个比nums[i]小的位置
            let left = 0; right = ret.length-1
            while (left < right) {
                let mid = (left + right) >> 1
                if (nums[i] <= ret[mid]) {
                    right = mid
                } else {
                    left = mid + 1
                }
            }
            ret[left] = nums[i]
        }
    }
    return ret.length
};