/*
524. 通过删除字母匹配到字典里最长单词

给你一个字符串 s 和一个字符串数组 dictionary 作为字典，
找出并返回字典中最长的字符串，该字符串可以通过删除 s 中的某些字符得到。

如果答案不止一个，返回长度最长且字典序最小的字符串。如果答案不存在，
则返回空字符串。
*/
var findLongestWord = function (s, dictionary) {
    let res = "";
    for (const t of dictionary) {
        let i = 0,
            j = 0;
        while (i < t.length && j < s.length) {
            if (t[i] === s[j]) {
                ++i;
            }
            ++j;
        }
        // 在子字符中的指针到结尾，则为s的自字符
        if (i === t.length) {
            // 子字符取尽可能长的，或者相同长度取字典序小的字符串
            if (t.length > res.length || (t.length === res.length && t < res)) {
                res = t;
            }
        }
    }
    return res;
};
