剑指 Offer II 035. 最小时间差

给定一个 24 小时制（小时:分钟 "HH:MM"）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。

 

示例 1：

输入：timePoints = ["23:59","00:00"]
输出：1
```js
var findMinDifference = function (timePoints) {
    let ar = []
    for (let x of timePoints) {
        let [h, m] = x.split(':')
        ar.push(h * 60 + m * 1)
    }
    ar.sort((a, b) => a - b)
    let ans = 24 * 60 + ar[0] - ar[ar.length - 1]
    for (let i = 1; i < ar.length; i++) {
        ans = Math.min(ans, ar[i] - ar[i - 1])
    }
    return ans
};
```