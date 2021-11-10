剑指 Offer 34. 二叉树中和为某一值的路径

给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

叶子节点 是指没有子节点的节点。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} target
 * @return {number[][]}
 */
var pathSum = function (root, target) {
    let ret = [],
        path = [];
    function dfs(root, target) {
        if (root == null) {
            return;
        }
        path.push(root.val);
        target -= root.val;
        if (root.left == null && root.right == null && target == 0) {
            ret.push([...path]);
        }
        dfs(root.left, target);
        dfs(root.right, target);
        path.pop();
    }

    dfs(root, target);
    return ret;
};
```
