// lowbit函数 返回x的二进制位的最后一位1的位权
// 例如：2 转化成二进制 10，故最后一位1的权重是2，同理 lowbit(3) =1,lowbit(4)=4
const lowbit = (x) => x & -x;
class FenwickTree {
    constructor(size) {
        this.n = size;
        this.c = Array(n + 1).fill(0);
    }
    // 给原数组第i位 增加x
    add(i, x) {
        while (i <= this.n) {
            this.c[i] += x;
            i += lowbit(i);
        }
        return;
    }
    // 查找原数组ind位上的数字
    at(ind) {
        return this.query(ind) - query(ind - 1);
    }
    // 查询原数组前x项的和
    query(x) {
        let sum = 0;
        while (x) {
            sum += this.c[x];
            x -= lowbit(x);
        }
        return sum;
    }
    output() {
        console.log(JSON.stringify(this.c));
    }
}
let n = 10;
let tree = new FenwickTree(n);
for (let i = 1; i <= n; i++) {
    tree.add(i, i);
}
tree.output();
console.log(tree.query(2));
