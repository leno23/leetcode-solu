// 单调队列 单调栈
/*
 滑动窗口 http://oj.haizeix.com/problem/271##
 给出一个长度为 N 的数组，一个长为 K 的滑动窗口从最左移动到最右，每次窗口移动，如下图：
                          min             max
 [1 3 -1] -3 5 3 6 7      -1              3
 1 [3 -1 -3] 5 3 6 7      -3              5
 1 3 [-1 -3 5] 3 6 7      -3              5
 1 3 -1 [-3 5 3] 6 7      -3              5
 1 3 -1 -3 [5 3 6] 7       3              6
 1 3 -1 -3 5 [3 6 7]       3              7   

 找出窗口在各个位置时的极大值和极小值。
*/

function func(k, arr) {
  // 记录下标
  let q = []
  for (let i = 0; i < arr.length; i++) {
    // 维护单调递增队列
    // 弹出不符合单调性的值
    while (q.length && arr[q[q.length - 1]] > arr[i]) q.pop()
    q.push(i)
    if (i - q[0] == k) q.shift()
    if (i + 1 < k) continue
    console.log('min-', arr[q[0]])
  }
  q.splice(0)

  // 维护单调递减队列
  for (let i = 0; i < arr.length; i++) {
    while (q.length && arr[q[q.length - 1]] < arr[i]) q.pop()
    q.push(i)
    if (i - q[0] == k) q.shift()
    if (i + 1 < k) continue
    console.log('max-', arr[q[0]])
  }
}

let arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
func(k, arr)