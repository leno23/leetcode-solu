/*
189. 旋转数组

给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。
进阶：

尽可能想出更多的解决方案，至少有三种不同的方法可以解决这个问题。
你可以使用空间复杂度为 O(1) 的 原地 算法解决这个问题吗？
 
*/
const reverse = (nums, start, end) => {
    while (start < end) {
        [nums[start++], nums[end--]] = [nums[end], nums[start]];
    }
};

var rotate = function (nums, k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
};
