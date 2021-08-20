/*

541. 反转字符串 II

给定一个字符串 s 和一个整数 k，从字符串开头算起，每 2k 个字符反转前 k 个字符。

如果剩余字符少于 k 个，则将剩余字符全部反转。
如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。

示例 1：

输入：s = "abcdefg", k = 2
输出："bacdfeg"
*/
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
// 传统遍历
var reverseStr = function (s, k) {
    let ret = "";
    for (let i = 0; i < s.length; i += 2 * k) {
        let a = [];
        for (let j = i; j < i + k; j++) if (s[j]) a.push(s[j]);
        for (let j = i; j < i + 2 * k; j++) {
            if (s[j]) ret += a.pop() || s[j];
        }
    }
    return ret;
};
// 双指针
var reverseStr = function (s, k) {
    const n = s.length;
    const arr = Array.from(s);
    for (let i = 0; i < n; i += 2 * k) {
        reverse(arr, i, Math.min(i + k, n) - 1);
    }
    return arr.join("");
};

const reverse = (arr, left, right) => {
    while (left < right) {
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
};
