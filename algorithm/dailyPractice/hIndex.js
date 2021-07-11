/*
  274. H 指数
  给定一位研究者论文被引用次数的数组（被引用次数是非负整数）。
  编写一个方法，计算出研究者的 h 指数。

  h 指数的定义：h 代表“高引用次数”（high citations），
  一名科研人员的 h 指数是指他（她）的 （N 篇论文中）总共有 h 
  篇论文分别被引用了至少 h 次。且其余的 N - h 篇论文每篇被引用次数 
  不超过 h 次。

  例如：某人的 h 指数是 20，这表示他已发表的论文中，
  每篇被引用了至少 20 次的论文总共有 20 篇。

*/
/**
 * @param {number[]} citations
 * @return {number}
 */
// h指数即数组倒叙排序后，数字所在下标+1不小于当前数字的最大值
// 例如 3 1 0 5 6 
//  逆序排列后
//    数字            0 1 3 5 6
// 逆序下标(从1开始)   5 4 3 2 1   
// 可以看出，上面的数字不小于下标的最大值 是 3

 var hIndex = function (citations) {
  citations.sort((a, b) => a - b) // 正序排列
  let h = 1 // h起到下标指针和计数的两个作用
  // 保证小标不大于数字时，进行逆序遍历
  while (citations[citations.length - h] >= h) h++
  return h - 1
};