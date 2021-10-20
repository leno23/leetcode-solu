剑指 Offer 50. 第一个只出现一次的字符

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

```js
/**
 * @param {string} s
 * @return {character}
 */
var firstUniqChar = function (s) {
    if (s == "") return " ";
    let cnt = new Array(26).fill(0);
    for (let x of s) cnt[x.charCodeAt() - "a".charCodeAt()]++;
    for (let i = 0; i < s.length; i++) {
        if (cnt[s[i].charCodeAt() - "a".charCodeAt()] == 1) return s[i];
    }
    return " ";
};
```
