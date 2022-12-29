79. 单词搜索

给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

 

示例 1：
![](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    let m = board.length, n = board[0].length
    let vis = Array(m).fill().map(() => Array(n).fill(0)), dir = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    // 从ij点出发是否可以匹配到第ind之后的字符串
    const dfs = (i, j, ind) => {
        if (ind == word.length) return true
        for (let [dx, dy] of dir) {
            let x = dx + i, y = dy + j
            if (x < 0 || x >= m || y < 0 || y >= n || vis[x][y] || word[ind] != board[x][y]) continue
            vis[x][y] = 1
            if (dfs(x, y, ind + 1)) return true
            vis[x][y] = 0
        }
        return false
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] != word[0]) continue
            vis[i][j] = 1
            if (dfs(i, j, 1)) return true
            // 回溯去掉标记
            vis[i][j] = 0
        }
    }
    return false
};