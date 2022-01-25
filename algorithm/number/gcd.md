欧几里得算法，也叫辗转相除法，用于计算两个非负正整数的最大公约数

```js
function gcd(a, b) {
    if (b) return gcd(b, a % b);
    return a;
}
```
假设b、a%b的最大公约数为c

则  b=k1*c 
    a%b = k2*c
又 a - kb = a%b (k是一个非负数)   
    a-kb = k2*c
    a=k2*c + kb = k2*c +k*k1*c = (k2+k*k1)c
而且 b=k1*c    
因此,c同时也是a、b的公约数

