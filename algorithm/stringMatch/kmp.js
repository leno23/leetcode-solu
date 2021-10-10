/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */

function kmp(text, pattern) {
    if (pattern == "") return 0;
    let n = pattern.length;
    let next = Array(n).fill(0);
    function getNext(pattern, next) {
        next[0] = -1;
        for (let i = 1, j = -1; pattern[i]; i++) {
            while (j != -1 && pattern[j + 1] != pattern[i]) j = next[j];
            if (pattern[j + 1] == pattern[i]) j++;
            next[i] = j;
        }
        return;
    }
    getNext(pattern, next);
    for (let i = 0, j = -1; text[i]; i++) {
        while (j != -1 && text[i] != pattern[j + 1]) j = next[j];
        if (text[i] == pattern[j + 1]) j++;
        if (!pattern[j + 1]) return i - j;
    }
    return -1;
}
