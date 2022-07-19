剑指 Offer 53 - I. 在排序数组中查找数字 I

统计一个数字在排序数组中出现的次数。

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let l = 0,
        r = nums.length - 1;
    // 利用二分查找到target最先出现的位置
    while (l < r) {
        let mid = l + ((r - l) >> 1);
        if (nums[mid] >= target) {
            r = mid;
        } else {
            l = mid + 1;
        }
    }
    let cnt = 0;
    while (nums[l++] == target) cnt++;
    return cnt;
};
```
