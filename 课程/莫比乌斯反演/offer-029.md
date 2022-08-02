剑指 Offer II 029. 排序的循环链表

给定循环单调非递减列表中的一个点，写一个函数向这个列表中插入一个新元素 insertVal ，使这个列表仍然是循环升序的。

给定的可以是这个列表中任意一个顶点的指针，并不一定是这个列表中最小元素的指针。

如果有多个满足条件的插入位置，可以选择任意一个位置插入新的值，插入后整个列表仍然保持有序。

如果列表为空（给定的节点是 null），需要创建一个循环有序列表并返回这个节点。否则。请返回原先给定的节点。

示例 1：
![](https://assets.leetcode.com/uploads/2019/01/19/example_1_before_65p.jpg)
输入：head = [3,4,1], insertVal = 2
输出：[3,4,1,2]
解释：在上图中，有一个包含三个元素的循环有序列表，你获得值为 3 的节点的指针，我们需要向表中插入元素 2 。新插入的节点应该在 1 和 3 之间，插入之后，整个列表如上图所示，最后返回节点 3 。
![](https://assets.leetcode.com/uploads/2019/01/19/example_1_after_65p.jpg)

```js
/**
 * // Definition for a Node.
 * function Node(val, next) {
 *     this.val = val;
 *     this.next = next;
 * };
 */

/**
 * @param {Node} head
 * @param {number} insertVal
 * @return {Node}
 */
var insert = function (head, insertVal) {
  let node = new Node(insertVal)
  // 输入空节点
  if (head == null) {
    node.next = node
    return node
  }
  // 初始化一个指针从head开始向后移动
  let p = head
  // 如果p的next指向head，证明走到了最后一个节点了
  while (head !== p.next) {
    // 插入的值的大小位于p和p.next的值之间，满足升序关系，找到了新值的插入位置
    if (
      insertVal >= p.val &&
      insertVal <= p.next.val
    )
      break
    // 在升序循环链表中，如果一个节点的值大于下一个节点的值，那么这个点一定是最大的值，下个节点是最小的值
    // 这个时候无论insertVal<min 或者 insertVal > max，都可以通过在最大值后面插入
    if (
      p.val > p.next.val &&
      (insertVal > p.val ||
        insertVal < p.next.val)
    )
      break
    p = p.next
  }
  // 代码走到这里，说明找到了带插入的节点p
  // 在p后面插入新节点即可
  let n = p.next
  p.next = node
  node.next = n
  return head
}
```
