/*
526. 优美的排列

假设有从 1 到 N 的 N 个整数，如果从这 N 个数字中成功构造出一个数组，使得数组的第 i 位 (1 <= i <= N)
 满足如下两个条件中的一个，我们就称这个数组为一个优美的排列。条件：

第 i 位的数字能被 i 整除
i 能被第 i 位上的数字整除
现在给定一个整数 N，请问可以构造多少个优美的排列？

*/
var countArrangement = function (n) {
    const vis = new Array(n + 1).fill(0);
    const match = new Array(n + 1).fill(0);
    let num = 0;
    for (let i = 0; i <= n; i++) {
        match[i] = [];
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (i % j === 0 || j % i === 0) {
                match[i].push(j);
            }
        }
    }

    const backtrack = (index, n) => {
        if (index === n + 1) {
            num++;
            return;
        }
        for (const x of match[index]) {
            if (!vis[x]) {
                vis[x] = true;
                backtrack(index + 1, n);
                vis[x] = false;
            }
        }
    };

    backtrack(1, n);
    return num;
};
