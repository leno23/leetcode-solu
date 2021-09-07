// 344. 反转字符串

/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
// 双指针
var reverseString = function (s) {
    let left = 0,
        right = s.length - 1;
    while (left < right) {
        let tmp = s[left];
        s[left] = s[right];
        s[right] = tmp;
        right--;
        left++;
    }
};
