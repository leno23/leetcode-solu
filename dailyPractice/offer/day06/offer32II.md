剑指 Offer 32 - II. 从上到下打印二叉树 II
从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

例如:
给定二叉树: [3,9,20,null,null,15,7],

    3

/ \
 9 20
/ \
 15 7
返回其层次遍历结果：

[
[3],
[9,20],
[15,7]
]

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
 * @return {number[][]}
 */
var levelOrder = function (root) {
    if (!root) return [];
    let ret = [],
        q = [root];
    while (q.length) {
        let tmp = [];
        // 这里必须是反向遍历，由于q.shift 会改变q.length影响遍历次数
        for (let i = q.length; i > 0; i--) {
            let node = q.shift();
            tmp.push(node.val);
            node.left && q.push(node.left);
            node.right && q.push(node.right);
        }
        ret.push(tmp);
    }
    return ret;
};
```
