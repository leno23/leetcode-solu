剑指 Offer 63. 股票的最大利润

假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
    let res = 0,
        min = prices[0];
    // 在遍历数组的过程中，维护一个最小值，最小值初试为prices[0]

    // 如果prices[i]大于min，则去更新一下利润res
    // 否则说明当前的prices[i]比min还小，则更新min
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] <= min) { 
            min = prices[i];
        } else {
            res = Math.max(res, prices[i] - min);
        }
    }
    return res;
};
```
