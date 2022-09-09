剑指 Offer II 019. 最多删除一个字符得到回文

给定一个非空字符串 s，请判断如果 最多 从字符串中删除一个字符能否得到一个回文字符串。

 

示例 1:

输入: s = "aba"
输出: true
```js
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function (s) {
    let n = s.length, l = 0, r = n - 1
    // 检查字符串l~r是否回文
    const check = (l, r) => {
        while (l < r) {
            if (s[l] == s[r]) l++, r--
            else return false
        }
        return true

    }
    while (l < r) {
        if (s[l] == s[r]) {
            l++, r--
        } else {
            // 尝试删除l或者r位置字符，看剩下字符是否回文
            return check(l + 1, r) || check(l, r - 1)
        }
    }
    // 原字符串回文或者空字符串
    return true
};