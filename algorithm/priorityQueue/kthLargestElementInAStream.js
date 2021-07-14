
/*
  703. 数据流中的第 K 大元素

  设计一个找到数据流中第 k 大元素的类（class）。注意是排序后的第 k 大元素，不是第 k 个不同的元素。

  请实现 KthLargest 类：

  KthLargest(int k, int[] nums) 使用整数 k 和整数流 nums 初始化对象。
  int add(int val) 将 val 插入数据流 nums 后，返回当前数据流中第 k 大的元素。
*/



/**
 * @param {number} k
 * @param {number[]} nums
 */
// 最小堆模板
class Heap {
  // 使用数组实现优先队列（堆）
  /*  
          1
        2   3       -->      1 2 3 4 5 6 7
      4  5  6  7              

  */
  constructor() {
      this.data = []
      this.cnt = 0
  }
  // 上浮
  push(x) {
      let ind = this.cnt
      this.data[this.cnt++] = x
      // (ind-1)>>1 为ind下标对应节点的父节点下标
      while (ind && this.data[(ind - 1) >> 1] > this.data[ind]) {
          this.swap((ind - 1) >> 1, ind)
          ind = (ind - 1) >> 1
      }
  }
  // 下沉
  pop() {
      let top = this.top()
      // 末尾元素赋值给头元素
      this.data[0] = this.data[--this.cnt] 
      this.data.length = this.cnt // 弹出头元素
      let n = this.cnt, ind = 0, temp = ind
      // 元素向下对比
      while (2 * ind + 1 <= n) { // 保证存在子节点
          // 与左子树对比
          if (this.data[ind * 2 + 1] < this.data[ind]) temp = ind * 2 + 1
          // 存在右子树情况下，与右子树对比
          if (2 * ind + 2 <= n && this.data[ind * 2 + 2] < this.data[temp]) temp = ind * 2 + 2
          // 位置未发生移动，则不需要继续下沉
          if (temp == ind) break
          // 位置发生移动，交换位置
          this.swap(ind, temp)
          // 更新当前位置，继续向下遍历
          ind = temp
      }
      return top
  }
  empty() {
      return this.cnt == 0
  }
  swap(a, b) {
      [this.data[a], this.data[b]] = [this.data[b], this.data[a]]
  }
  top() {
      return this.data[0]
  }
}
var KthLargest = function (k, nums) {
  // 维护数组最大值使用最小堆
  let h = new Heap()
  for (let v of nums) h.push(v)
  this.h = h
  this.k = k
};

/** 
* @param {number} val
* @return {number}
*/
KthLargest.prototype.add = function (val) {
  this.h.push(val)
  let k = this.k
  // 保证在push过程数组中始终维护前k大数
  while (this.h.data.length > k) this.h.pop()
  return this.h.top()
};

/**
* Your KthLargest object will be instantiated and called as such:
* var obj = new KthLargest(k, nums)
* var param_1 = obj.add(val)
*/