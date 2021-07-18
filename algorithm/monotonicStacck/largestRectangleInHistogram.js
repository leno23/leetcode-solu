/*
84. 柱状图中最大的矩形

给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。
求在该柱状图中，能够勾勒出来的矩形的最大面积。

*/
/**
 * @param {number[]} heights
 * @return {number}
 */
 var largestRectangleArea = function (heights) {
  let s = []
  let n = heights.length
  let l = [], r = []
  for (let i = 0; i < n; i++) l[i] = -1, r[i] = n
  for (let i = 0; i < n; i++) {
      // 使用<= 牺牲找左边界的准确性，但是不影响最终答案的正确
      while (s.length && heights[i] <= heights[s[s.length - 1]]) {
          r[s[s.length - 1]] = i
          s.pop()
      }
      if (s.length) l[i] = s[s.length - 1]
      s.push(i)
  }
  let ans = 0
  for (let i = 0; i < n; i++) {
      ans = Math.max(ans, heights[i] * (r[i] - l[i] - 1))
  }
  return ans

};