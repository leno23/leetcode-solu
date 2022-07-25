/*
371. 两整数之和

给你两个整数 a 和 b ，不使用 运算符 + 和 - ​​​​​​​，计算并返回两整数之和。
*/
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function (a, b) {
    while (b) {
        let c = (a & b) << 1;
        a ^= b;
        b = c;
    }
    return a;
};
