[337. 打家劫舍 III](https://leetcode.cn/problems/house-robber-iii/)

已解答

中等

相关标签

相关企业

小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 `root` 。

除了 `root` 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果 **两个直接相连的房子在同一天晚上被打劫** ，房屋将自动报警。

给定二叉树的 `root` 。返回 ***在不触动警报的情况下** ，小偷能够盗取的最高金额* 。

 

**示例 1:**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/645197ecfa1a4a85862704c5020fe3df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=277&h=293&s=11037&e=jpg&b=fefafa)

```
输入: root = [3,2,3,null,3,null,1]
输出: 7 
解释: 小偷一晚能够盗取的最高金额 3 + 3 + 1 = 7
```

**示例 2:**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/711d16c3ab8842de8c2c8a5e96af1503~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=357&h=293&s=13065&e=jpg&b=fefcfc)

```
输入: root = [3,4,5,1,3,null,1]
输出: 9
解释: 小偷一晚能够盗取的最高金额 4 + 5 = 9
```

 

**提示：**

-   树的节点数在 `[1, 104]` 范围内
-   `0 <= Node.val <= 104`

```py
class Solution:
    def rob(self, root: TreeNode) -> int:
        # 偷当前节点的最大值
        def dfs(root):
            # 空节点偷或者不偷都为0
            if not root:
                return 0,0
            # 根据子节点的值计算当前节点的值
            l_rob,l_not_rob = dfs(root.left)
            r_rob,r_not_rob = dfs(root.right)
            # 当前节点偷的话，左右子节点都不能偷
            rob = root.val + l_not_rob + r_not_rob
            # 当前节点不偷，就对 左右子节点得到最大值 求和
            not_rob = max(l_rob, l_not_rob) + max(r_rob, r_not_rob)
            return rob,not_rob
        return max(dfs(root))
```