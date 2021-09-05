/*
977. 有序数组的平方

给你一个按 非递减顺序 排序的整数数组 nums，
返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。
*/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
    let n = nums.length;
    let ans = Array(n);
    for (let i = 0, j = n - 1, pos = n - 1; i <= j; pos--) {
        if (nums[i] ** 2 > nums[j] ** 2) ans[pos] = nums[i++] ** 2;
        else ans[pos] = nums[j--] ** 2;
    }
    return ans;
};
