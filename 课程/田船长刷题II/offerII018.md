剑指 Offer II 018. 有效的回文

给定一个字符串 s ，验证 s 是否是 回文串 ，只考虑字母和数字字符，可以忽略字母的大小写。

本题中，将空字符串定义为有效的 回文串 。

 

示例 1:

输入: s = "A man, a plan, a canal: Panama"
输出: true
解释："amanaplanacanalpanama" 是回文串
```js
var isPalindrome = function (s) {
    let arr = []
    for (let x of s) {
        if (x == ' ') continue
        if (x >= 0 && x <= 9) {
            arr.push(x)
            continue
        }
        let a = x.toLowerCase()
        if (a.charCodeAt() >= 97 && a.charCodeAt() < 97 + 26) arr.push(a)
    }
    let n = arr.length
    for (let i = 0; i < n / 2 | 0; i++) {
        if (arr[i] != arr[n - 1 - i]) return false
    }
    return true
};
```