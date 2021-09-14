// 206. 反转链表

var reverseList = function (head) {
    if (!head) return null
    let pre = null, next = head.next
    while (head) {
        next = head.next
        head.next = pre
        pre = head
        head = next
    }
    return pre
};
