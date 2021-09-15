// 784. 字母大小写全排列

/**
 * @param {string} s
 * @return {string[]}
 */
var letterCasePermutation = function (s) {
    let ret = [""];
    const isLetter = (s) => s.charCodeAt() > 57;
    for (let t of s) {
        if (isLetter(t)) {
            let temp = [...ret];
            for (let i = 0; i < ret.length; i++) {
                ret[i] += t.toLowerCase();
                temp[i] += t.toUpperCase();
            }
            ret.push(...temp);
        } else {
            for (let i = 0; i < ret.length; i++) ret[i] += t;
        }
    }
    return ret;
};
