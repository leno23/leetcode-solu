/*
1894. 找到需要补充粉笔的学生编号

一个班级里有 n 个学生，编号为 0 到 n - 1 。每个学生会依次回答问题，
编号为 0 的学生先回答，然后是编号为 1 的学生，以此类推，直到编号为 n - 1 的学生，
然后老师会重复这个过程，重新从编号为 0 的学生开始回答问题。

给你一个长度为 n 且下标从 0 开始的整数数组 chalk 和一个整数 k 。
一开始粉笔盒里总共有 k 支粉笔。当编号为 i 的学生回答问题时，
他会消耗 chalk[i] 支粉笔。如果剩余粉笔数量 严格小于 chalk[i] ，
那么学生 i 需要 补充 粉笔。

请你返回需要 补充 粉笔的学生 编号 。

*/
/**
 * @param {number[]} chalk
 * @param {number} k
 * @return {number}
 */
 var chalkReplacer = function (chalk, k) {
    let pre = [...chalk]
    // 前缀和数组
    for (let i = 1; i < chalk.length; i++) pre[i] += pre[i - 1]
    let rest = k % pre[pre.length - 1]  // n轮之后剩余的粉笔，在下一轮会使用完
    // 在前缀和数组中使用二分找到一个大于等于rest的元素下标，即为粉笔使用完的学生编号
    let left = 0, right = pre.length - 1, mid
    while (left < right) {
        mid = ((right - left) >> 1) + left
        if (pre[mid] < rest) {
            left = mid + 1
        } else if (pre[mid] == rest) {
            return mid + 1
        } else {
            right = mid
        }
    }
    return left
};