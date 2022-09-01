```js
var isStraight = function (nums) {
    nums.sort((a, b) => a - b)
    let n = nums.length
    let cnt0 = 0
    for (let x of nums) if (x == 0) cnt0++
    let cnt1 = 0
    for (let i = 1; i < n; i++) {
        if (nums[i - 1] == 0) continue
        let d = nums[i] - nums[i - 1]
        if (d == 0) return false
        if (d > 1) {
            cnt1 += d - 1
        }
    }
    return cnt0 >= cnt1
};
// 使用最大值-最小值
var isStraight = function (nums) {
    nums.sort((a, b) => a - b)
    let cnt0 = 0
    for (let x of nums) if (x == 0) cnt0++
    for (let i = cnt0 + 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return false
    }
    let max = nums[4]
    let min = cnt0 == 5 ? nums[4] : nums[cnt0]
    if (max - min < 5) return true
    return false
};
```