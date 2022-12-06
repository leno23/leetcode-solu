https://atcoder.jp/contests/abc059/tasks/arc072_a

输入 n (2≤n≤1e5) 和一个长为 n 的数组 a (-1e9≤a[i]≤1e9)。
每次操作你可以把一个 a[i] 加一或减一。
如果要让 a 的所有相邻前缀和的乘积都小于 0，至少需要操作多少次？

input 

4
1 -3 1 0

output 

4

```js
// 使得相邻前缀和乘积小于0，最小操作时 前缀和要么为1 -1 1 -1，要么为-1 1 -1 1
// 那么，分别求原数组前缀和变成这两种序列时的操作数，取最小即可
var a = require("fs").readFileSync("/dev/stdin", "utf8").split("\n")[1].split(" ").map(e => parseInt(e, 10));

// 前缀和以正数还是负数开头
function f(p) {
  let res = 0,sum = 0
  for(let x of a){
    sum += x
    if(p * sum <=0){
        // 当前项与1 -1的距离，也就是最小的操作变为负数或者正数
        res += Math.abs(sum - p)
        // 修改当前数字之后，前缀和也发生变化
        sum = p
    }
    // 下一项符号相反
    p*= -1
  }
  return res
}
console.log(Math.min(f(-1), f(1)));