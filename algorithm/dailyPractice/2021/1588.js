/*
1588. 所有奇数长度子数组的和

给你一个正整数数组 arr ，请你计算所有可能的奇数长度子数组的和。

子数组 定义为原数组中的一个连续子序列。

请你返回 arr 中 所有奇数长度子数组的和 。

*/
/**
 * @param {number[]} arr
 * @return {number}
 */
var sumOddLengthSubarrays = function (arr) {
    let n = arr.length;
    // 前缀和
    let prefix = [arr[0]];
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    let sum = 0;
    // 遍历所有数字，对所有可能的奇数长度子数组求和
    for (let start = 0; start < n; start++) {
        // 求以当前数字开始的所有所有奇数长度的子数组的和
        for (let length = 1; start + length <= n; length += 2) {
            sum += prefix[start + length] - prefix[start];
        }
    }
    return sum;
};
