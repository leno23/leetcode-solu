剑指 Offer 22. 链表中倒数第 k 个节点

输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

示例：

给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function (head, k) {
    // 两次正序遍历
    // 第一次求出节点总数cnt，第二次找到正数第cnt-k个节点位置
    // let cnt = 0, cur = head
    // while (head) head = head.next, cnt++

    // let x = cnt - k
    // while (x--) cur = cur.next
    // return cur

    // 快慢指针-一次遍历
    // 快慢指针初始化指向头
    let fast = head,
        slow = head;
    // 首先让快指针指向正数第k个数
    while (k--) fast = fast.next;
    // 快慢一起移动，fast遍历结束，slow指向的即为倒数第k个的节点位置
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    return slow;
};
```
