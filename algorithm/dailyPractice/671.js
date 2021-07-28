
/*
671. 二叉树中第二小的节点

给定一个非空特殊的二叉树，每个节点都是正数，并且每个节点的子节点数量只能为 2 或 0。如果一个节点有两个子节点的话，那么该节点的值等于两个子节点中较小的一个。

更正式地说，root.val = min(root.left.val, root.right.val) 总成立。

给出这样的一个二叉树，你需要输出所有节点中的第二小的值。如果第二小的值不存在的话，输出 -1 。

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
 * @return {number}
 */
 var findSecondMinimumValue = function (root) {
  if (!root) return
  // 方法1 比较挫的方法
  let ret = []
  const dfs = root => {
      if (!root) return
      ret.push(root.val)
      dfs(root.left)
      dfs(root.right)
  }
  // 遍历整棵树，拿到所有值之后，经过排序、去重，返回第二个元素
  dfs(root)
  return [...new Set(ret.sort((a, b) => a - b))][1] || -1


  // 方法2 仿写官方解答的
  // 从题目提示可以知道，树的根节点的值不大于子节点的值
  // let ans = -1
  // let rootVal = root.val  // 根节点为最小值
  // const dfs = root => {
  //     if (!root || ans != -1 && ans <= root.val) return
  //     if (root.val > rootVal) ans = root.val
  //     dfs(root.left)
  //     dfs(root.right)
  // }
  // dfs(root)
  // return ans
};