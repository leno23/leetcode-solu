let MAX_N = 100;
let mu = Array(MAX_N + 5).fill(0);
let prime = Array(MAX_N + 5).fill(0);
function init_prime(n) {
    mu[1] = 1;
    for (let i = 2; i <= n; i++) {
        if (!prime[i]) {
            prime[++prime[0]] = i;
            mu[i] = -1;
        }
        for (let j = 1; j <= prime[0]; j++) {
            if (i * prime[j] > n) break;
            prime[i * prime[j]] = 1;
            if (i % prime[j] == 0) break;
            mu[i * prime[j]] = -mu[i];
        }
    }
}
init_prime(10)
for(let i=1;i<=10;i++){
  console.log(i,mu[i])
}
