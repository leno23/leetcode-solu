剑指 Offer II 027. 回文链表

简单

108

相关企业

给定一个链表的 **头节点** `head` **，** 请判断其是否为回文链表。

如果一个链表是回文，那么链表节点序列从前往后看和从后往前看是相同的。

 

**示例 1：**

**![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3648211efe14a279406e98ef3de5744~tplv-k3u1fbpfcp-zoom-1.image)**

```
输入: head = [1,2,3,3,2,1]
输出: true
```

**示例 2：**

**![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b10a220eba1b4d48ba4bc774bf19c5dc~tplv-k3u1fbpfcp-zoom-1.image)**

```
输入: head = [1,2]
输出: false
```

```py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        # 记录一个链表头结点
        p=head
        def dfs(head):
            nonlocal p
            # 空节点是回文的
            if not head:
                return True
            res = dfs(head.next)
            # 向左回溯时，更新答案，将p向右移动一位，保持前后节点的对应，便于检查是否回文
            res = res and p.val==head.val
            p=p.next
            return res
        return dfs(head)