/*
678. 有效的括号字符串

给定一个只包含三种字符的字符串：（ ，） 和 *，
写一个函数来检验这个字符串是否为有效字符串。有效字符串具有如下规则：

任何左括号 ( 必须有相应的右括号 )。
任何右括号 ) 必须有相应的左括号 ( 。
左括号 ( 必须在对应的右括号之前 )。
* 可以被视为单个右括号 ) ，或单个左括号 ( ，或一个空字符串。
一个空字符串也被视为有效字符串。
示例 1:

输入: "()"
输出: True
*/
var checkValidString = function (s) {
    const n = s.length;
    const dp = new Array(n).fill(0).map(() => new Array(n).fill(false));
    for (let i = 0; i < n; i++) {
        if (s[i] === "*") {
            dp[i][i] = true;
        }
    }
    for (let i = 1; i < n; i++) {
        const c1 = s[i - 1],
            c2 = s[i];
        dp[i - 1][i] = (c1 === "(" || c1 === "*") && (c2 === ")" || c2 === "*");
    }
    for (let i = n - 3; i >= 0; i--) {
        const c1 = s[i];
        for (let j = i + 2; j < n; j++) {
            const c2 = s[j];
            if ((c1 === "(" || c1 === "*") && (c2 === ")" || c2 === "*")) {
                dp[i][j] = dp[i + 1][j - 1];
            }
            for (let k = i; k < j && !dp[i][j]; k++) {
                dp[i][j] = dp[i][k] && dp[k + 1][j];
            }
        }
    }
    return dp[0][n - 1];
};
