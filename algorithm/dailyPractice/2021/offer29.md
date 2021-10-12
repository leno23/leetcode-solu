---
noteId: "d9c0b7602b7011ec99cdaf7823804003"
tags: []

---

剑指 Offer 29. 顺时针打印矩阵

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

输入：matrix = [
[1,2,3],
[4,5,6],
[7,8,9]
]
输出：[1,2,3,6,9,8,7,4,5]

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
    let ret = [];
    function circle(arr) {
        let len = arr.length;
        if (!len) return; // 数组为空时结束
        let m = arr[0].length,
            i = m - 2,
            j = 0;

        /* 四个方向进行打印*/
        // 上
        ret.push(...arr.shift());
        // 右
        for (; j < len - 1; j++) ret.push(arr[j].pop());
        arr = arr.filter((v) => v.length);
        if (!len) return;
        // 下
        for (; i > -1; i--) ret.push(arr[len - 2][i]);
        arr.pop();
        if (!len) return;
        // 左
        for (j = len - 3; j > -1; j--) ret.push(arr[j].shift());
        arr = arr.filter((v) => v.length);
        if (!len) return;
        circle(arr); // 类似剥洋葱处理，继续递归
    }
    circle(matrix);
    return ret;
};
```
