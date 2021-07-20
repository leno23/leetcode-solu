/*
  42. 接雨水

  给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，
  下雨之后能接多少雨水。
*/
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  let ans = 0
  let s = []
  for (let i = 0; i < height.length; i++) {
    while (s.length && height[i] > height[s[s.length - 1]]) {
      let now = s[s.length - 1]
      s.pop()
      if (s.length == 0) continue
      let a = height[i] - height[now]
      let b = height[s[s.length - 1]] - height[now]
      ans += (i - s[s.length - 1] - 1) * Math.min(a, b)
    }
    s.push(i)
  }
  return ans

};