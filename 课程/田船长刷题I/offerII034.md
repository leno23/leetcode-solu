剑指 Offer II 034. 外星语言是否排序

某种外星语也使用英文小写字母，但可能顺序 order 不同。字母表的顺序（order）是一些小写字母的排列。

给定一组用外星语书写的单词 words，以及其字母表的顺序 order，只有当给定的单词在这种外星语中按字典序排列时，返回 true；否则，返回 false。

 

示例 1：

输入：words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
输出：true
解释：在该语言的字母表中，'h' 位于 'l' 之前，所以单词序列是按字典序排列的。
```js
var isAlienSorted = function (words, order) {
    let ar = []
    // 记录每个字符的排名
    for (let i = 0; i < order.length; i++) ar[order[i].charCodeAt()] = i
    for (let i = 1; i < words.length; i++) {
        let len = Math.max(words[i].length, words[i - 1].length)
        for (let j = 0; j < len; j++) {
            let cur = words[i][j], pre = words[i - 1][j]
            if (cur && pre) {
                if (ar[pre.charCodeAt()] > ar[cur.charCodeAt()]) {
                    return false
                } else if (ar[pre.charCodeAt()] < ar[cur.charCodeAt()]) {
                    break
                }
            } else if (pre && cur == null) {
                return false
            }
        }
    }
    return true
};
```