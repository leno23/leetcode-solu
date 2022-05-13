面试题 01.05. 一次编辑

字符串有三种编辑操作:插入一个字符、删除一个字符或者替换一个字符。 给定两个字符串，编写一个函数判定它们是否只需要一次(或者零次)编辑。

示例 1:

输入:
first = "pale"
second = "ple"
输出: True

```js
/**
 * @param {string} first
 * @param {string} second
 * @return {boolean}
 */
var oneEditAway = function (first, second) {
  let len = first.length - second.length
  if (len > 1 || len < -1) return false
  let cnt = 1
  for (
    let i = 0, j = 0;
    i < first.length && j < second.length;
    i++, j++
  ) {
    if (first[i] != second[j]) {
      if (len == 1) j--
      else if (len == -1) i--
      cnt--
    }
    if (cnt < 0) return false
  }
  return true
}
```
