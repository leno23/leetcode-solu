// 35. 搜索插入位置

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
    let left = 0,
        right = nums.length - 1,
        mid;
    if (target > nums[nums.length - 1]) return n;
    while (left < right) {
        mid = ((right - left) >> 1) + left;
        if (nums[mid] > target) {
            right = mid;
        } else if (nums[mid] == target) {
            return mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
};
