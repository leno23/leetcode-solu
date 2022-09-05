剑指 Offer II 014. 字符串中的变位词

给定两个字符串 s1 和 s2，写一个函数来判断 s2 是否包含 s1 的某个变位词。

换句话说，第一个字符串的排列之一是第二个字符串的 子串 。

 

示例 1：

输入: s1 = "ab" s2 = "eidbaooo"
输出: True
解释: s2 包含 s1 的排列之一 ("ba").
```js
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
    // 定长滑动窗口，长度为s1的长度
    let m = s1.length, n = s2.length
    // s1比s2长，不可能为s2的子串
    if (m > n) return false
    // 统计s1长度范围，s1 s2每个字符的个数
    let n1 = Array(128).fill(0), n2 = Array(128).fill(0)
    for (let i = 0; i < m; i++) {
        n1[s1[i].charCodeAt()]++
        n2[s2[i].charCodeAt()]++
    }
    // 窗口和s1个数不同的字符的个数
    let cnt = 0
    for (let i = 0; i < 26; i++) {
        if (n1[97 + i] != n2[97 + i]) cnt++
    }
    // 窗口初始在0~m-1位置,从m位置开始移动
    for (let i = m; i < n; i++) {
        if (cnt === 0) {
            // 两个字符长度相同，每个字符的个数也相同，那么一个字符就是另外一个字符的排列
            break
        }
        let right = s2[i].charCodeAt(), left = s2[i - m].charCodeAt()
        // 新加入一个字符right，如果s1和窗口中这个字符的个数相同，现在窗口中增加一个这个字符，不同字符的个数就增加一个
        if (n1[right] == n2[right]) cnt++
        n2[right]++ // 窗口中right字符个数+1
        // 新加入right字符后，判断right字符个数是否相同，相同的话cnt-1
        if (n1[right] == n2[right]) cnt--
        // 窗口前面移除一个字符，同样进行判断
        if (n1[left] == n2[left]) cnt++
        n2[left]--
        if (n1[left] == n2[left]) cnt--

    }
    return cnt == 0

};
