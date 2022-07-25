// 3. 无重复字符的最长子串

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let map = new Map();
    let max = 0,
        start = 0;
    for (let end = 0; end < s.length; end++) {
        let ch = s[end];
        if (map.has(ch)) {
            start = Math.max(map.get(ch) + 1, start);
        }
        max = Math.max(max, end - start + 1);
        map.set(ch, end);
    }
    return max;
};
