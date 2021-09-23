/*
326. 3的幂

给定一个整数，写一个函数来判断它是否是 3 的幂次方。如果是，返回 true ；否则，返回 false 。

整数 n 是 3 的幂次方需满足：存在整数 x 使得 n == 3x

*/
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
    // 由于 3 ** 19 < 2*31,而且3 ** 20 > 2 * 31
    // 则满足题意的最大数为3 ** 19
    // return n > 0 && !(3 ** 19 % n)
    while (n && n % 3 == 0) {
        n /= 3;
    }
    return n == 1;
};
