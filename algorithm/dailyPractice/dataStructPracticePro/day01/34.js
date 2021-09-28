// 34. 在排序数组中查找元素的第一个和最后一个位置

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    if (nums.length == 1) return nums[0] == target ? [0, 0] : [-1, -1];
    let left = 0,
        right = nums.length - 1,
        mid,
        ret = [];
    // 查找元素在数组中的第一个位置
    while (left < right) {
        mid = ((right - left) >> 1) + left;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    ret.push(nums[left] == target ? left : -1);
    // 查找在数组中的最后一个位置
    (left = 0), (right = nums.length);
    while (left < right) {
        mid = ((right - left) >> 1) + left;
        if (nums[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    ret.push(nums[left - 1] == target ? left - 1 : -1);
    return ret;
};
