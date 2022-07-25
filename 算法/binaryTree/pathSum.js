/*
  112. 路径总和

  给你二叉树的根节点 root 和一个表示目标和的整数 targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。

  叶子节点 是指没有子节点的节点。
*/

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
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  // 空树，即使targetSum=0，也返回false
  if (root == null) return false
  // 遍历到叶子节点，如果剩余步数为0，则返回true，否则返回false
  if (root.left == null && root.right == null) return targetSum - root.val == 0
  // 存在左右子树，向下遍历，并将targetSum剩余的数字带入
  if (root.left && hasPathSum(root.left, targetSum - root.val)) return true
  if (root.right && hasPathSum(root.right, targetSum - root.val)) return true
  // 遍历结束仍没有返回，则返回false
  return false
};