
let arr = []
const toNums = v => v.split(' ').map(Number)
require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
}).on('line', line => {
    arr.push(line)
    let [m, n] = toNums(arr[0])
    if (arr.length < m + 1) return
    console.log(arr)
    let a = Array(m).fill().map(() => Array(n).fill(0)), p = []
    for (let i = 0; i < m; i++) {
        let row = toNums(arr[i + 1])
        for (let j = 0; j < n; j++) {
            a[i][j] = row[j]
            if (a[i][j] == 2) p.push([i, j])
        }
    }
    const bfs = (i, j) => {
        let a1 = Array(m).fill().map(() => Array(n).fill(0))
        const dir = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        const vis = Array(m).fill(0).map(() => Array(n).fill(0))
        let q = [[i, j]]
        vis[i][j] = 1
        while (q.length) {
            let [i1, j1] = q.shift()
            for (let [dx, dy] of dir) {
                let x = dx + i1, y = dy + j1
                if (x < 0 || x >= m || y < 0 || y >= n || vis[x][y] || a[x][y] == 1) continue
                if (a[x][y] == 3) a1[x][y] = 1
                q.push([x, y])
                vis[x][y] = 1
            }
        }
        return a1
    }
    const a1 = bfs(...p[0]), a2 = bfs(...p[1])
    let res = 0
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (a[i][j] == 3 && a1[i][j] && a2[i][j]) res++
        }
    }
    console.log(res)
})

