/*
718. 最长重复子数组

给两个整数数组 A 和 B ，返回两个数组中公共的、长度最长的子数组的长度。
 
*/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
    let res = 0;
    let m = nums1.length,
        n = nums2.length,
        dp = Array(m + 1)
            .fill()
            .map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        let c1 = nums1[i - 1];
        for (let j = 1; j <= n; j++) {
            let c2 = nums2[j - 1];
            if (c1 == c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                res = Math.max(res, dp[i][j]);
            }
        }
    }
    return res;
};
