剑指 Offer 06. 从尾到头打印链表

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function (head) {
    if (!head) return [];
    let ret = [];
    while (head) ret.push(head.val), (head = head.next);
    let s = [];
    while (ret.length) s.push(ret.pop());
    return s;
};
```
