let maxN = 5000
let prime = Array(maxN + 5).fill(0)

// 线性筛算法生成素数
const initPrime = () => {
    for (let i = 2; i <= maxN; i++) {
        if (!prime[i]) prime[++prime[0]] = i
        for (let j = 1; j <= prime[0]; j++) {
            if (i * prime[j] > maxN) break
            prime[i * prime[j]] = 1
            if (i % prime[j] == 0) break
        }
    }
    return
}
initPrime()
let p_ind, q_ind, p, q
// 生成两个随机较大素数
do {
    p_ind = prime[0] - (Math.random() * 100 | 0)
    q_ind = prime[0] - (Math.random() * 100 | 0)
} while (p_ind == q_ind)
p = prime[p_ind]
q = prime[q_ind]

// 定义n
let n = p*q
// 定义phi_n
let phi_n = (p - 1) * (q - 1)
const gcd = (a, b) => b ? gcd(b, a % b) : a

let e = 0
// 扩展欧几里得计算 模逆元
function get_inv(a, b, arr) {
    if (b == 0) {
        arr[0] = 1;
        arr[1] = 0;
        return a;
    }
    let r = get_inv(b, a % b, arr);
    let temp = arr[0];
    arr[0] = arr[1];
    arr[1] = temp - (a / b|0) * arr[1];
    return r;
}
// 快速幂取余
function quick_mod(a, b, mod) {
    let res = 1, tmp = a
    while (b) {
        if (b & 1) res = res * tmp % mod
        tmp = tmp * tmp % mod
        b >>= 1
    }
    return res
}
// 生成e作为公钥
do {
    e = Math.random() * phi_n | 0
} while (e == 0 || gcd(e, phi_n) != 1)

let pair = [0,0]

// 获取e对于phi_n的逆元d，作为私钥
get_inv(e, phi_n, pair)

let d = ((pair[0] % phi_n) + phi_n) % phi_n
console.log(e,phi_n,d);

// 验证生成的数字的合法性
console.log('mod', (e * d) % phi_n)

// 使用e,n 编码
function encode(num){
    return quick_mod(num, e, n)
}
// 使用d,n 解码
function decode(num){
    return quick_mod(num, d, n)
}

let num = 28134
let res = encode(num, d, n)
console.log(decode(res))
