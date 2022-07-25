
/*

翻转一棵二叉树。

输入：
     4                     
   /   \ 
  2     7         
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

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
 * @return {TreeNode}
 */
var invertTree = function (root) {
    // 定义一个翻转二叉树的方法
    function invert(root) {
        // 特判
        if (!root) return root
        // 保存右子树的引用
        let tmp = root.right
        // 将右子树引用指向左子树
        root.right = root.left
        // 将左子树引用指向右子树
        root.left = tmp
        // 分别翻转左右子树
        invert(root.left)
        invert(root.right)
    }
    invert(root)
    return root  // 返回翻转后的二叉树
};