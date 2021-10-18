剑指 Offer 03. 数组中重复的数字

找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0 ～ n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function (nums) {
    // 借助map，在遍历过程记录数字出现的次数,当次数>1时return
    var m = new Map();
    for (let x of nums) {
        if (m.get(x) == 1) return x;
        else m.set(x, 1);
    }
};
```
