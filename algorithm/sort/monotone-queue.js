// 单调队列 单调栈

function func(k, arr) {
  // 记录下标
  let q = []
  for (let i = 0; i < arr.length; i++) {
    while (q.length && arr[q[q.length - 1]] > arr[i]) q.pop()
    q.push(i)
    if (i - q[0] == k) q.shift()
    if (i + 1 < k) continue
    console.log('min-', arr[q[0]])
  }
  q.splice(0)
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