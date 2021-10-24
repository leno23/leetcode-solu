剑指 Offer 46. 把数字翻译成字符串

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

示例 1:

输入: 12258
输出: 5
解释: 12258 有 5 种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"

```js
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function (num) {
    // let ret = []
    // while (num) {
    //     ret.unshift(num % 10)
    //     num = num / 10 | 0
    // }
    // let n = ret.length, dp = Array(n).fill(0)
    // dp[0] = 1
    // if (ret[0] * 10 + ret[1] <= 25) dp[1] = 2
    // else dp[1] = 1
    // for (let i = 2; i < ret.length; i++) {
    //     if (ret[i - 1] * 10 + ret[i] <= 25 && ret[i - 1]) {
    //         dp[i] = dp[i - 1] + dp[i - 2]
    //     } else dp[i] = dp[i - 1]
    // }
    // return dp[dp.length - 1]

    // 由于递推公式中当前项依赖上两项的值，所以这里使用两个变量来存储来优化时间
    // 上个值和上上个值
    let pre = 1,
        prepre = 1,
        preNum,
        curNum = num % 10;
    // 使用除法倒序遍历num的每一位
    while (num != 0) {
        num = (num / 10) | 0;
        // 上一位数
        preNum = num % 10;
        // 当前数与 上一位数组成的二位数
        let tmp = 10 * preNum + curNum;
        // 相当于dp[i]=dp[i-1]+dp[i-2]
        let cur = tmp >= 10 && tmp <= 25 ? pre + prepre : pre;
        prepre = pre;
        pre = cur;
        curNum = preNum;
    }
    return pre;
};
```
