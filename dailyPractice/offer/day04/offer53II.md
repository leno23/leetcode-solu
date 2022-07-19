剑指 Offer 53 - II. 0 ～ n-1 中缺失的数字

一个长度为 n-1 的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围 0 ～ n-1 之内。在范围 0 ～ n-1 内的 n 个数字中有且只有一个数字不在该数组中，请找出这个数字。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function (nums) {
    // 利用缺失数字左右两边下标和数字的一致性划分二段,进行二分
    let l = 0,
        r = nums.length - 1;
    while (l <= r) {
        let mid = l + ((r - l) >> 1);
        if (nums[mid] == mid) l = mid + 1;
        else r = mid - 1;
    }
    return l;
};
```
