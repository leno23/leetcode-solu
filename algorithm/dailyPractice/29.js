/*
剑指 Offer 29. 顺时针打印矩阵

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

输入：matrix = [
      [1,2,3],
      [4,5,6],
      [7,8,9]
    ]
输出：[1,2,3,6,9,8,7,4,5]

*/
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
 var spiralOrder = function (matrix) {
  function circle(arr, ret) {
      // 特判
      if (arr.length == 0) return ret
      let i = 0;
      // 首行直接push
      ret.push(...arr.shift())

      // 从前往后将末尾元素弹出
      for (; i < arr.length; i++) ret.push(arr[i].pop())
      if (arr.length == 0) return ret
      // 下标移动到末尾
      i--

      // 最后一行数据，反向push进数组中
      let lastLen = arr[i].length - 1
      for (j = lastLen; j >= 0; j--) ret.push(arr[i].pop())

      arr = arr.filter(it => it.length)
      if (arr.length == 0) return ret
      i--

      // 反向向前遍历将首位元素push
      for (; i > 0; i--) ret.push(arr[i].shift())
      // 过滤空元素
      arr = arr.filter(it => it.length)
      return circle(arr, ret)
  }

  return circle(matrix, [])

};