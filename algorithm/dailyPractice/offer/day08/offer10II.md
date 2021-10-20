剑指 Offer 10- II. 青蛙跳台阶问题

一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

```js
/**
 * @param {number} n
 * @return {number}
 */
// 解法和斐波那契数据相同
var numWays = function (n) {
    let f = [1, 1];
    for (let i = 2; i <= n; i++) {
        f[i] = (f[i - 1] + f[i - 2]) % (1e9 + 7);
    }
    return f[n];
};
```
