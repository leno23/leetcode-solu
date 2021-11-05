剑指 Offer 13. 机器人的运动范围

地上有一个 m 行 n 列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于 k 的格子。例如，当 k 为 18 时，机器人能够进入方格 [35, 37] ，因为 3+5+3+7=18。但它不能进入方格 [35, 38]，因为 3+5+3+8=19。请问该机器人能够到达多少个格子？

示例 1：

输入：m = 2, n = 3, k = 1
输出：3

```js
/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var movingCount = function (m, n, k) {
    let visited = Array(m)
        .fill()
        .map(() => Array(n).fill(false));
    const dfs = (i, j, m, n, k, visited) => {
        if (
            i < 0 ||
            i >= m ||
            j < 0 ||
            j >= n ||
            ((i / 10) | 0) + (i % 10) + ((j / 10) | 0) + (j % 10) > k ||
            visited[i][j]
        )
            return 0;
        visited[i][j] = true;
        return (
            1 +
            dfs(i + 1, j, m, n, k, visited) +
            dfs(i - 1, j, m, n, k, visited) +
            dfs(i, j + 1, m, n, k, visited) +
            dfs(i, j - 1, m, n, k, visited)
        );
    };
    return dfs(0, 0, m, n, k, visited);
};
```
