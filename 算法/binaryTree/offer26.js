/*

剑指 Offer 26. 树的子结构
输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

例如:
给定的树 A:

     3
    / \
   4   5
  / \
 1   2
给定的树 B：

   4 
  /
 1
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。
*/

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
  // 从A的头部开始和B比较，判断B是否为A的子树
  function isMatch(A, B) {
    // B为null时，为A的子节点
    if (B == null) return true;
    // A==null说明B的树高大于A，不成立;值不相同，也不成立
    if (A == null || A.val != B.val) return false;
    // 向下递归判断
    return isMatch(A.left, B.left) && isMatch(A.right, B.right);
  }
  // 由题意可知，A和B任一为null，则返回false
  if (A == null || B == null) return false;
  if (isMatch(A, B)) return true;
  // B从A的当前节点向下比较，不成立，则继续向下递归判断
  return isSubStructure(A.left, B) || isSubStructure(A.right, B);
};
