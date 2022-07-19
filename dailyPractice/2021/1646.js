/*
1646. 获取生成数组中的最大值

给你一个整数 n 。按下述规则生成一个长度为 n + 1 的数组 nums ：

nums[0] = 0
nums[1] = 1
当 2 <= 2 * i <= n 时，nums[2 * i] = nums[i]
当 2 <= 2 * i + 1 <= n 时，nums[2 * i + 1] = nums[i] + nums[i + 1]
返回生成数组 nums 中的 最大 值。
*/
/**
 * @param {number} n
 * @return {number}
 */
var getMaximumGenerated = function (n) {
    if (n == 0) return 0;
    let nums = [0, 1];
    for (let i = 1; i < n; i++) {
        if (2 * i >= 2 && 2 * i <= n) nums[2 * i] = nums[i];
        if (2 <= 2 * i + 1 && 2 * i + 1 <= n)
            nums[2 * i + 1] = nums[i] + nums[i + 1];
    }
    return Math.max(...nums);
};
