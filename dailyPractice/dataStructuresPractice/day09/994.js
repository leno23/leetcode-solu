// 994. 腐烂的橘子

const orangesRotting = (grid) => {
    const queue = [];
    let unrotten = 0; // 完好的个数
    const height = grid.length;
    const width = grid[0].length;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j]); // 所有的坏橘子的坐标推入队列
            } else if (grid[i][j] === 1) {
                unrotten++; // 统计好橘子的个数
            }
        }
    }
    if (unrotten == 0) return 0; //如果没有好橘子，直接返回0
    let level = 0; // 树的层次，即腐坏所用的时间
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0]; // 代表4个方向
    while (queue.length) {
        // queue队列不为空就继续循环
        const levelSize = queue.length; // 当前层节点个数
        level++; // 层次+1
        for (let i = 0; i < levelSize; i++) {
            // 当前层节点出列
            let cur = queue.shift();
            for (let j = 0; j < 4; j++) {
                let x = cur[0] + dx[j];
                let y = cur[1] + dy[j];
                if (
                    x < 0 ||
                    x >= height ||
                    y < 0 ||
                    y >= width ||
                    grid[x][y] !== 1
                )
                    continue; // 腐化好橘子，超出边界或本身就不是好橘子，跳过
                grid[x][y] = 2; // 将好橘子腐化，避免它被重复遍历
                queue.push([x, y]); // 推入队列，下次循环就将它们出列
                unrotten--; // 好橘子个数-1
            }
        }
    }
    return unrotten === 0 ? level - 1 : -1; // 好橘子如果还存在，返回-1
};
