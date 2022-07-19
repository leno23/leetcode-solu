// 557. 反转字符串中的单词 III

/**
 * @param {string} s
 * @return {string}
 */
// 双指针解法
 var reverseWords = function (s) {
    const ret = [];
    const length = s.length;
    let i = 0;
    while (i < length) {
        let start = i;
        while (i < length && s[i] != ' ') {
            i++;
        }
        for (let p = start; p < i; p++) {
            ret.push(s[start + i - 1 - p]);
        }
        while (i < length && s[i] == ' ') {
            i++;
            ret.push(' ');
        }
    }
    return ret.join('');
};