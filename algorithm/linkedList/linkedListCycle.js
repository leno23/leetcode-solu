/*
141. 环形链表

给定一个链表，判断链表中是否有环。

 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置
 （索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。
 注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

*/
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  // 为空，或者只有一个节点，则不能成环
  if (!head || !head.next) return false
  // 慢指针走一步
  let slow = head.next
  // 慢指针走两步
  let fast = slow.next
  // 保证快慢指针存在的情况下，遍历链表，如果存在fast==slow，则表示成环
  while (slow && fast) {
    slow = slow.next
    fast = fast.next && fast.next.next
    if (slow == fast) return true
  }
  // 遍历结束没有返回，则没有成环
  return false
};