17. 从尾到头打印链表
  
输入一个链表的头结点，按照 **从尾到头** 的顺序返回节点的值。

返回的结果用数组存储。

#### 数据范围

0≤0≤ 链表长度 ≤1000≤1000。

#### 样例

```
输入：[2, 3, 5]
返回：[5, 3, 2]
```

```py
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None
class Solution(object):
    def printListReversingly(self, head):
        def f(p):
            if not p:
                return []
            res=f(p.next)
            res.append(p.val)
            
            return res
        return f(head)