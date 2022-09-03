剑指 Offer 56 - II. 数组中数字出现的次数 II
在一个数组 nums 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

 

示例 1：

输入：nums = [3,4,3,3]
输出：4
```js
var singleNumber = function (nums) {
    let cnt = Array(31).fill(0)
    // 统计所有数字每个二进制位上1的个数
    for (let x of nums) {
        let ind = 0
        while (x >> ind) {
            if (x >> ind & 1) cnt[ind]++
            ind++
        }
    }
    let res = 0
    // 出现3次的数字在某个二进制位上的1的个数肯定是3的倍数，如果遇到某一位对3取余有余数，
    // 则说明 只出现一次的数字落在了这一位上
    // 统计出 只出现一次的数字落在的每个二进制位上，最终将所有位组合后即为答案
    for (let i = 0; i < 31; i++) {
        if (cnt[i] % 3) {
            res |= 1 << i
        }
    }
    return res
};
```