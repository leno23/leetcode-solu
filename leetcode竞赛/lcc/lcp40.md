```js
/**
 * @param {number[]} cards
 * @param {number} cnt
 * @return {number}
 */
var maxmiumScore = function (nums, cnt) {
    // 将卡牌从大到小排序后，先拿到最大的cnt张牌，并求和
    // 如果和是偶数直接返回，如果是奇数就将最小的一张奇数牌换成一张较大的偶数牌，或者将最小的偶数牌
    // 换成一张较大的奇数牌
    let n = nums.length
    nums.sort((a, b) => b - a)
    let cnt1 = 0
    let sum = 0
    for (let i = 0; i < cnt; i++) {
        sum += nums[i]
        if (nums[i] & 1) cnt1++
    }
    // 没有奇数牌或者奇数牌有偶数个，总和为偶数
    if (cnt1 >= 0 && cnt1 % 2 == 0) return sum
    let ind = cnt, ind2 = ind, res = 0
    // 从后面找一张最大的偶数牌
    while (ind < n && nums[ind] & 1) ind++
    if (nums[ind]) {
        let i = cnt - 1
        // 从选出的卡牌中找到一张最小的奇数牌进行更换
        while (i >= 0 && nums[i] % 2 == 0) i--
        if (nums[i]) {
            res = sum - nums[i] + nums[ind]
        }
    }
    // 从后面找一张最大的奇数牌
    while (ind2 < n && nums[ind2] % 2 == 0) ind2++
    if (nums[ind2]) {
        let i = cnt - 1
        // 从选出的卡牌中找到一张最小的偶数牌进行更换
        while (i >= 0 && (nums[i] & 1)) i--
        if (nums[i]) {
            res = Math.max(res, sum - nums[i] + nums[ind2])
        }
    }
    return res
};