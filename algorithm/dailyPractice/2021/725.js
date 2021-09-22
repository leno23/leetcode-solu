/*
725. 分隔链表
 给你一个头结点为 head 的单链表和一个整数 k ，请你设计一个算法将链表分隔为
 k 个连续的部分。

每部分的长度应该尽可能的相等：任意两部分的长度差距不能超过 1 。
这可能会导致有些部分为 null 。

这 k 个部分应该按照在链表中出现的顺序排列，
并且排在前面的部分的长度应该大于或等于排在后面的长度。

返回一个由上述 k 部分组成的数组。

*/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode[]}
 */
var splitListToParts = function (head, k) {
    let cnt = 0;
    let p = head;

    while (p != null) {
        p = p.next;
        cnt++;
    }

    // 有多少个长度是 cnt + 1
    let rmn = cnt % k;
    cnt = (cnt / k) | 0;

    p = head;
    let pre = new ListNode(0);

    let ans = [];

    while (p != null) {
        ans.push(p);
        for (let i = 0; i < cnt; i++) {
            pre = p;
            p = p.next;
        }
        if (rmn) {
            rmn--;
            pre = p;
            p = p.next;
        }
        // 一刀两断，如意神剑
        pre.next = null;
    }

    let empty = k - ans.length;
    for (let i = 0; i < empty; i++) ans.push(null);

    return ans;
};
