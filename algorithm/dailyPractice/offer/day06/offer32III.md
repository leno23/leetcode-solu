剑指 Offer 32 - III. 从上到下打印二叉树 III

请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

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
[20,9],
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
        q = [root],
        cnt = 0;
    while (q.length) {
        let tmp = [];
        // 这里必须是反向遍历，由于q.shift 会改变q.length影响遍历次数
        for (let i = q.length; i > 0; i--) {
            let node = q.shift();

            if (cnt % 2) tmp.unshift(node.val);
            else tmp.push(node.val);
            node.left && q.push(node.left);
            node.right && q.push(node.right);
        }
        cnt++;
        ret.push(tmp);
    }
    return ret;
};
```
