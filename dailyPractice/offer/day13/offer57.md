剑指 Offer 57. 和为 s 的两个数字

输入一个递增排序的数组和一个数字 s，在数组中查找两个数，使得它们的和正好是 s。如果有多对数字的和等于 s，则输出任意一对即可。

示例 1：

输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    let l = 0,
        r = nums.length - 1;
    while (l < r) {
        let cur = nums[l] + nums[r];
        if (target == cur) {
            return [nums[l], nums[r]];
        } else if (cur < target) l++;
        else r--;
    }
    return [];
};
```
