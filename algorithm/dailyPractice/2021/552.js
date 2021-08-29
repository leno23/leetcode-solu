/*
552. 学生出勤记录 II

可以用字符串表示一个学生的出勤记录，其中的每个字符用来标记当天的出勤情况（缺勤、迟到、到场）。记录中只含下面三种字符：
'A'：Absent，缺勤
'L'：Late，迟到
'P'：Present，到场
如果学生能够 同时 满足下面两个条件，则可以获得出勤奖励：

按 总出勤 计，学生缺勤（'A'）严格 少于两天。
学生 不会 存在 连续 3 天或 连续 3 天以上的迟到（'L'）记录。
给你一个整数 n ，表示出勤记录的长度（次数）。请你返回记录长度为 n 时，可能获得出勤奖励的记录情况 数量 。
答案可能很大，所以返回对 109 + 7 取余 的结果。

*/
// 矩阵快速幂需要研究下
var checkRecord = function (n) {
    const MOD = BigInt(1000000007);

    const pow = (mat, n) => {
        let ret = [[1, 0, 0, 0, 0, 0]];
        while (n > 0) {
            if ((n & 1) === 1) {
                ret = multiply(ret, mat);
            }
            n >>= 1;
            mat = multiply(mat, mat);
        }
        return ret;
    };

    const multiply = (a, b) => {
        const rows = a.length,
            columns = b[0].length,
            temp = b.length;
        const c = new Array(rows)
            .fill(0)
            .map(() => new Array(columns).fill(BigInt(0)));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                for (let k = 0; k < temp; k++) {
                    c[i][j] += BigInt(BigInt(a[i][k]) * BigInt(b[k][j]));
                    c[i][j] %= MOD;
                }
            }
        }
        return c;
    };

    const mat = [
        [1, 1, 0, 1, 0, 0],
        [1, 0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0],
    ];
    const res = pow(mat, n);
    const sum = BigInt(eval(res[0].join("+")));
    return sum % MOD;
};
