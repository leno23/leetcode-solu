/*
  剑指 Offer 24. 反转链表

  定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
  输入: 1->2->3->4->5->NULL
  输出: 5->4->3->2->1->NULL
*/

// 迭代
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  // 思路：在遍历链表过程中，将每个节点作为头结点指向结果链表
  // 特判
  if (head == null) return head
  // 记录遍历过程上次遍历的结果
  let prev = null
  while (head) {
    // 保存head的next引用，由于将head节点放到头部需要改变它的next引用，这样会导致遍历出现异常
    let n = head.next
    // 遍历过程将节点放到上次返回的链表的头部，从而最终生成相反顺序的序列
    head.next = prev
    // 将当前结果保存起来
    prev = head
    // 恢复head
    head = n
  }
  return prev
};

// 递归
// todo 暂时未理解 
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  // 特判
  if (!head || !head.next) return head
  let p = reverseList(head.next)
  head.next.next = head
  head.next = null
  return p
};