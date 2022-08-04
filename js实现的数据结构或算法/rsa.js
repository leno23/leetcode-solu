let maxN = BigInt(5e5)
let prime = Array(maxN + 5n).fill(0n)


// rsa算法过程
// 1.生成两个大素数p q(线性筛)       
// 2.令n = p*q,phi_n = (p-1)*(q-1) (计算欧拉函数)  
// 3.(1~phi_n)范围随机生成一个 e与phi_n互质 (欧几里得算法)
// 4.求出e对于phi_n的逆元   d*e ===1(mod phi_n) (扩展欧几里得算法)
// 5.生成公钥(e,n),私钥(d,n)
// 6.加密解密 (快速幂)


// 线性筛算法生成素数
const initPrime = () => {
    for (let i = 2n; i <= maxN; i++) {
        if (!prime[i]) prime[++prime[0]] = i
        for (let j = 1n; j <= prime[0]; j++) {
            if (i * prime[j] > maxN) break
            prime[i * prime[j]] = 1n
            if (i % prime[j] == 0n) break
        }
    }
    return
}
initPrime()
let p_ind, q_ind, p, q
// 生成两个随机较大素数
do {
    p_ind = prime[0] - BigInt(Math.random() * 100 | 0)
    q_ind = prime[0] - BigInt(Math.random() * 100 | 0)
} while (p_ind == q_ind)
p = prime[p_ind]
q = prime[q_ind]

// 定义n
let n = p * q
console.log('秘钥长度-->',n.toString(2).length);
// 定义phi_n
let phi_n = (p - 1n) * (q - 1n)
const gcd = (a, b) => b ? gcd(b, a % b) : a

let e = 0
// 扩展欧几里得计算 模逆元
function get_inv(a, b, arr) {
    if (b == 0n) {
        arr[0] = 1n;
        arr[1] = 0n;
        return a;
    }
    let r = get_inv(b, a % b, arr);
    [arr[0],arr[1]] = [arr[1],arr[0] - (a / b | 0n) * arr[1]]
    return r;
}
// 快速幂取余
function quick_mod(a, b, mod) {
    let res = 1n, tmp = a
    while (b) {
        if (b & 1n) res = res * tmp % mod
        tmp = tmp * tmp % mod
        b >>= 1n
    }
    return res
}
// 生成e作为公钥
console.log(phi_n);
do {
    e = BigInt(Math.random() * Number(phi_n) | 0)
} while (e == 0n || gcd(e, phi_n) != 1n)

let pair = [0n, 0n]

// 获取e对于phi_n的逆元d，作为私钥
get_inv(e, phi_n, pair)

let d = ((pair[0] % phi_n) + phi_n) % phi_n
console.log(e, phi_n, d);

// 验证生成的数字的合法性
console.log('mod', (e * d) % phi_n)

// 使用e,n 编码
function encode(num) {
    return quick_mod(num, e, n)
}
// 使用d,n 解码
function decode(num) {
    return quick_mod(num, d, n)
}

let num = 123456789n
let secret = encode(num, d, n)
console.log(decode(secret))
