/*
413. 等差数列划分

如果一个数列 至少有三个元素 ，并且任意两个相邻元素之差相同，则称该数列为等差数列。

例如，[1,3,5,7,9]、[7,7,7,7] 和 [3,-1,-5,-9] 都是等差数列。
给你一个整数数组 nums ，返回数组 nums 中所有为等差数组的 子数组 个数。

子数组 是数组中的一个连续序列。

示例 1：

输入：nums = [1,2,3,4]
输出：3
解释：nums 中有三个子等差数组：[1, 2, 3]、[2, 3, 4] 和 [1,2,3,4] 自身。

*/
/**
 * @param {number[]} nums
 * @return {number}
 */
 var numberOfArithmeticSlices = function (nums) {
    let diffs = [] // 构造差分数组
    for (let i = 1; i < nums.length; i++) diffs.push(nums[i] - nums[i - 1])
    let a = 1, arr = []
    // 构造每个等差子序列长度的数组
    for (let i = 1; i < diffs.length; i++) {
        if (diffs[i] == diffs[i - 1]) a++
        else {
            arr.push(a)
            a = 1
        }
    }
    arr.push(a)
    let res = 0
    // 每个等差子序列的中的子数组个数求和
    for (let v of arr) {
        if (v != 1) {
            res += v * (v - 1) / 2
        }
    }
    return res
};