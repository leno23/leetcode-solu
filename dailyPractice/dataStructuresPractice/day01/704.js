// 704. 二分查找
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let left = 0,
        right = nums.length - 1;
    while (left <= right) {
        let mid = ((right - left) >> 1) + left;
        if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] == target) {
            return mid;
        } else {
            right = mid - 1;
        }
    }
    return -1;
};
