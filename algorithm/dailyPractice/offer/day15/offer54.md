剑指 Offer 54. 二叉搜索树的第 k 大节点

给定一棵二叉搜索树，请找出其中第 k 大的节点。

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
 * @param {number} k
 * @return {number}
 */
var kthLargest = function (root, k) {
    let res;
    function dfs(root) {
        if (root == null) return 0;
        dfs(root.right);
        if (k == 0) return;
        if (--k == 0) res = root.val;
        dfs(root.left);
    }
    dfs(root);
    return res;
};
```
