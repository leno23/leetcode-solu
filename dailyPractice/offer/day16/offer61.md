剑指 Offer 61. 扑克牌中的顺子

从若干副扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这 5 张牌是不是连续的。2 ～ 10 为数字本身，A 为 1，J 为 11，Q 为 12，K 为 13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

示例 1:

输入: [1,2,3,4,5]
输出: True

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function (nums) {
    nums.sort((a, b) => a - b);
    let j = 0,
        nus = [];
    for (let x of nums) {
        if (x == 0) j++;
        else nus.push(x);
    }

    for (let i = 1; i < nus.length; i++) {
        let diff = nus[i] - nus[i - 1];
        if (diff == 0) return false;
        if (diff > 1) j -= diff - 1;
    }
    return j >= 0;
};
```
