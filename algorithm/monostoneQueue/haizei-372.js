/*
  372. 双生序列

  u，v 两个序列趋势相同，当且仅当对于任意 l 和 r，均有 RMQ(u,l,r)=RMQ(v,l,r) (1≤l≤r≤n)，

  其中 n 是序列长度，RMQ(u,l,r) 是 u 序列从 l 到 r 中的最小值（有可能有多个最小值）的最大下标。

  现有两个序列 A={a1,a2,a3,…,an}，B={b1,b2,b3,…,bn} 两个序列

  请求出最大的 p，使得A‘={a1,a2,a3,…,ap} 与B‘={b1,b2,b3,…,bp} 趋势相同。

  找到一个p使得两个序列的RMQ(递增序列)趋势相同
*/
function func(arr1, arr2) {
  let q1 = [], q2 = [], p
  for (p = 0; p < arr1.length; p++) {
    // 维护q1和q2的单调性，保证递增
    while (q1.length && arr1[p] < q1[q1.length - 1]) q1.pop()
    while (q2.length && arr2[p] < q2[q2.length - 1]) q2.pop()
    // 从单调队列中弹出不符合单调性的值之后，将当前值入队
    q1.push(arr1[p])
    q2.push(arr2[p])
    console.log(q1, q2);
    // 若两个序列的单调序列长度不同，则此时的p为最大值
    if (q1.length != q2.length) break
  }
  return p
}
let arr1 = [3, 1, 5, 2, 4], arr2 = [5, 2, 4, 3, 1]
const p = func(arr1, arr2)
console.log(p);