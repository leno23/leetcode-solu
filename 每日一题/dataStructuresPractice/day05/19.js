// 19. 删除链表的倒数第 N 个结点

var removeNthFromEnd = function (head, n) {
    if (head == null || head.next == null) return null;
    let len = 0,
        copy = head;
    while (copy) {
        len++;
        copy = copy.next;
    }
    let t = len - n;
    // 添加虚拟头结点，防止删除位置在头结点时无法操作的问题
    let dummy = new ListNode();
    dummy.next = head;
    copy = dummy;
    while (dummy) {
        if (t == 0) {
            dummy.next = dummy.next.next;
            break;
        }
        t--;
        dummy = dummy.next;
    }
    return copy.next;
};
