剑指 Offer II 033. 变位词组

给定一个字符串数组 strs ，将 变位词 组合在一起。 可以按任意顺序返回结果列表。

注意：若两个字符串中每个字符出现的次数都相同，则称它们互为变位词。

 

示例 1:

输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
```js
var groupAnagrams = function (strs) {
    // m记录每个单词的字典序词组在ans中的位置
    let m = new Map(), ans = []
    for (let x of strs) {
        let c = [...x]
        // 每一个单词字典序排序
        c.sort()
        let s = c + ''
        // 当前字典序如果出现过，找到在ans中的位置并放入
        if (m.has(s)) {
            ans[m.get(s)].push(x)
        } else {
            // 记录当前字典序在ans中的位置
            m.set(s, ans.length)
            ans.push([x])
        }
    }
    return ans
};
```