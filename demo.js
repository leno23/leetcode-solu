let arr = []
const toNums = v => v.split(' ').map(Number)
require('readline').createInterface({ input: process.stdin, output: process.stdout }).on('line', line => {
    arr.push(line)

    if (arr.length < +arr[0] + 1) return
    let nums = arr.slice(1).map(v => toNums(v))
    nums.sort((a, b) => a[0] == b[0] ? b[1] - a[1] : a[0] - b[0])
    let dp = Array(nums.length).fill(1)
    let res = 0
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i][1] > nums[j][1]) dp[i] = Math.max(dp[i], dp[j] + 1)
        }
        if (dp[i] > res) res = dp[i]
    }
    console.log(res)
})
/*
4
20 16
15 11
10 10
9 10

*/