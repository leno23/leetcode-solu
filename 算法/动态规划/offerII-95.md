剑指 Offer II 095. 最长公共子序列

给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。

一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。

 

示例 1：

输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
```js
var longestCommonSubsequence = function (text1, text2) {
    // dp[i][j] text1前i位和text2的前j位的最长公共子序列
    let m = text1.length, n = text2.length
    let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // 前i位的最后一位下标为i-1，如果最后一位相同，则最长公共子序列的长度+1
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
            } else {
                // text1 text2最后一位不同，那么两个字符串的最长公共子序列要么 在text1前i-1位和text2前i位 要么
                // 在text1前i位和text2前i-1位 的最长公共子序列中产生
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }
    return dp[m][n]
};