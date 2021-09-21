/*
面试题 17.14. 最小K个数

设计一个算法，找出数组中最小的k个数。以任意顺序返回这k个数均可。
*/
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var smallestK = function (arr, k) {
  let q = new MinPriorityQueue();
  for (let v of arr) {
    q.enqueue(v);
  }
  let ret = [];
  while (k--) ret.push(q.dequeue().element);
  return ret;
};
