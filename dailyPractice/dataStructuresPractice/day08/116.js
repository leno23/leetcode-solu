// 617. 合并二叉树

var mergeTrees = function (t1, t2) {
    if (t1 == null) {
        return t2;
    }
    if (t2 == null) {
        return t1;
    }
    let merged = new TreeNode(t1.val + t2.val);
    merged.left = mergeTrees(t1.left, t2.left);
    merged.right = mergeTrees(t1.right, t2.right);
    return merged;
};
