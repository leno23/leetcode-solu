欧几里得算法，也叫辗转相除法，用于计算两个非负正整数的最大公约数

```js
function gcd(a, b) {
    if (b) return gcd(b, a % b);
    return a;
}
```
