LCP 02. 分式化简

有一个同学在学习分式。他需要将一个连分数化成最简分数，你能帮助他吗？

连分数是形如上图的分式。在本题中，所有系数都是大于等于 0 的整数。

输入的 cont 代表连分数的系数（cont[0]代表上图的 a0，以此类推）。返回一个长度为 2 的数组[n, m]，使得连分数的值等于 n / m，且 n, m 最大公约数为 1。

示例 1：
![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/09/09/fraction_example_1.jpg)
输入：cont = [3, 2, 0, 2]
输出：[13, 4]
解释：原连分数等价于 3 + (1 / (2 + (1 / (0 + 1 / 2))))。注意[26, 8], [-13, -4]都不是正确答案。

```js
/**
 * @param {number[]} cont
 * @return {number[]}
 */
var fraction = function (cont) {
  let ans = [1, 0]
  for (let i = cont.length; i--; ) {
    ans.reverse()
    ans[0] += cont[i] * ans[1]
  }
  return ans
}
```
