剑指 Offer 48. 最长不含重复字符的子字符串

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

示例 1:

输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let start = -1, // 滑动窗口左指针
        m = new Map(),
        res = 0;
    for (let j = 0; j < s.length; j++) {
        // 如果发现相同元素a，左指针移动到a上次出现的位置
        if (m.has(s[j])) {
            start = Math.max(start, m.get(s[j]));
        }
        // 记录字符出现的位置
        m.set(s[j], j);
        // 更新最大值
        res = Math.max(res, j - start);
    }
    return res;
};
```
