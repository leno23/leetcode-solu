// 542. 01 矩阵

/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (matrix) {
    let m = matrix.length,
        n = matrix[0].length;
    let dp = Array(m)
        .fill()
        .map(() => Array(n));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dp[i][j] = matrix[i][j] == 0 ? 0 : 10000;
        }
    }

    // 从左上角开始
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i - 1 >= 0) {
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + 1);
            }
            if (j - 1 >= 0) {
                dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + 1);
            }
        }
    }
    // 从右下角开始
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (i + 1 < m) {
                dp[i][j] = Math.min(dp[i][j], dp[i + 1][j] + 1);
            }
            if (j + 1 < n) {
                dp[i][j] = Math.min(dp[i][j], dp[i][j + 1] + 1);
            }
        }
    }
    return dp;
};
