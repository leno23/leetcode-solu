剑指 Offer 32 - I. 从上到下打印二叉树
从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

例如:
给定二叉树: [3,9,20,null,null,15,7],

    3

/ \
 9 20
/ \
 15 7
返回：

[3,9,20,15,7]

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root) {
    if (!root) return [];
    let q = [root],
        ans = [];
    while (q.length) {
        let node = q.shift();
        ans.push(node.val);
        if (node.left) q.push(node.left);
        if (node.right) q.push(node.right);
    }
    return ans;
};
```
