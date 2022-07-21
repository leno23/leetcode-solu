// 问题： 给定N,M，求1<=x<=N,1<=y<=m 且gcd(x,y)为质数的(x,y)有多少对
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const is_prime = (n) => { 
    if (n <= 1) return 0;
    for (let i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
};
let N = 3,
    M = 5;
let res = 0;
for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
        if (!is_prime(gcd(i, j))) continue;
        res++;
        console.log(`(${i},${j})`);
    }
}
console.log("total: ", res);
