剑指 Offer 21. 调整数组顺序使奇数位于偶数前面

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

示例：

输入：nums = [1,2,3,4]
输出：[1,3,2,4]
注：[3,1,2,4] 也是正确的答案之一。

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function (nums) {
    let n = nums.length,
        x = 0,
        y = n - 1;
    while (x < y) {
        // 找到左边第一个奇数
        while (x < y && (nums[x] & 1) == 1) x++;
        // 找到右边第一个偶数
        while (x < y && (nums[y] & 1) != 1) y--;
        [nums[x], nums[y]] = [nums[y], nums[x]];
    }
    return nums;
};
```
