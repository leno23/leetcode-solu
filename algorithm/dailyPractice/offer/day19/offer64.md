剑指 Offer 64. 求 1+2+…+n

求 1+2+...+n ，要求不能使用乘除法、for、while、if、else、switch、case 等关键字及条件判断语句（A?B:C）。

示例 1：

输入: n = 3
输出: 6

```js
/**
 * @param {number} n
 * @return {number}
 */
var sumNums = function (n) {
    return n && sumNums(n - 1) + n;
};
```
