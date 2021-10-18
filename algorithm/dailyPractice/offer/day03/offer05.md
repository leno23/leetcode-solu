剑指 Offer 05. 替换空格
请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function (s) {
    // 直接使用正则进行替换 g对所有符合匹配规则的目标进行替换
    return s.replace(/\s/g, "%20");
};
```
