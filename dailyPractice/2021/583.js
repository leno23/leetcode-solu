/*
583. 两个字符串的删除操作

给定两个单词 word1 和 word2，找到使得 word1 和 word2 相同所需的最小步数，
每步可以删除任意一个字符串中的一个字符。

*/
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
    // 转化为最长公共子序列问题(LCS)
    // 关于LCS，考虑一个问题，比如需要求 abcde ace的最长公共子序列的长度
    /**
        例如 字符串s1,s2的最后一个字符分别是c1,c2,
        去掉最后一个字符之后分别是q1,q2,
        LCS(s1,s2)表示s1、s2的LCS值max(a,b) 表示a、b中较大值
        则他们的最长公共子字符为
        若c1==c2  则 LCS(s1,s2) = LCS(q1,q2) + 1
        否则   LCS(s1,s2)=  max(LCS(s1, q2), LCS(q1, s2))
     */
    let m = word1.length,
        n = word2.length,
        // dp[i][j] 表示word1的前i个字符和word2的前j个字符的最长公共子序列的长度
        dp = Array(m + 1)
            .fill()
            .map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        let c1 = word1[i - 1];
        for (let j = 1; j <= n; j++) {
            let c2 = word2[j - 1];
            if (c1 == c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    let lcs = dp[m][n];
    return m - lcs + n - lcs;
};
