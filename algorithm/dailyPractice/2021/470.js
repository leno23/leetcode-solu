/*
470. 用 Rand7() 实现 Rand10()

已有方法 rand7 可生成 1 到 7 范围内的均匀随机整数，试写一个方法 rand10 生成 1 到 10 范围内的均匀随机整数。

不要使用系统的 Math.random() 方法。

*/
var rand10 = function () {
    for (;;) {
        // rand7  [1,7]
        // rand7() - 1   [0,6]
        // (rand7() - 1) * 7  [0,42]
        // (rand7() - 1) * 7 + rand7()  [1,49]

        let res = (rand7() - 1) * 7 + rand7();
        // 将[1,40]区间的随机数转化成[1,10]之间的随机数
        if (res <= 40) return (res % 10) + 1;
    }
};
