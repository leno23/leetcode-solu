剑指 Offer II 005. 单词长度的最大乘积

给定一个字符串数组 words，请计算当两个字符串 words[i] 和 words[j] 不包含相同字符时，它们长度的乘积的最大值。假设字符串中只包含英语的小写字母。如果没有不包含相同字符的一对字符串，返回 0。

 

示例 1:

输入: words = ["abcw","baz","foo","bar","fxyz","abcdef"]
输出: 16 
解释: 这两个单词为 "abcw", "fxyz"。它们不包含相同字符，且长度的乘积最大。
```js
var maxProduct = function (words) {
    let n = words.length, mask = []
    // 将每个单词映射为一个二进制码
    // 将字母a-z映射成 1-26个二进制位
    for (let x of words) {
        let cur = 0
        for (let c of x) {
            cur |= (1 << c.charCodeAt() - 97)
        }
        mask.push(cur)
    }
    let res = 0
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // 如果两个单词的二进制码异或为0，说明两个单词的二进制位均不同，也就是字母均不同
            if ((mask[i] & mask[j]) == 0) {
                res = Math.max(res, words[i].length * words[j].length)
            }
        }
    }
    return res
};
```