const lowbit = (x) => x & -x;
class FenwickTree {
    constructor(size) {
        this.n = size;
        this.c = Array(n + 1).fill(0);
    }
    add(i, x) {
        while (i <= this.n) {
            this.c[i] += x;
            i += lowbit(i);
        }
        return;
    }
    at(ind) {
        return this.query(ind) - query(ind - 1);
    }
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
