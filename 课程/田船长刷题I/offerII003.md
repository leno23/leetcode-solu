剑指 Offer II 003. 前 n 个数字二进制中 1 的个数

给定一个非负整数 n ，请计算 0 到 n 之间的每个数字的二进制表示中 1 的个数，并输出一个数组。

 

示例 1:

输入: n = 2
输出: [0,1,1]
解释: 
0 --> 0
1 --> 1
2 --> 10
```js
var countBits = function (n) {
    /*
    动态规划思想
    1    001  
    2    010  2是偶数 1的个数就等于第2/1 = 1个数中1的个数 
    3    011  3是奇数，1的个数就等于上个数字1个数+1
    4    010  ...
    5    101
    6    110


    */
    let dp = Array(n + 1).fill(0)
    dp[0] = 0
    for (let i = 1; i <= n; i++) {
        if (i & 1) {
            dp[i] = dp[i - 1] + 1
        } else {
            dp[i] = dp[i / 2]
        }
    }
    return dp
};
```