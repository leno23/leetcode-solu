剑指 Offer 26. 树的子结构

输入两棵二叉树 A 和 B，判断 B 是不是 A 的子结构。(约定空树不是任意一个树的子结构)

B 是 A 的子结构， 即 A 中有出现和 B 相同的结构和节点值。

例如:
给定的树 A:

     3
    / \

4 5
/ \
 1 2
给定的树 B：

4
/
1
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function (A, B) {
    const isMatch = (A, B) => {
        if (B == null) return true;
        if (A == null) return false;
        if (A.val != B.val) return false;
        return isMatch(A.left, B.left) && isMatch(A.right, B.right);
    };
    if (A == null || B == null) return false;

    // B和A匹配，或者和A的左子树匹配，或者和A的右子树匹配
    return (
        isMatch(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
    );
};
```
