// 线段树
// 应用场景：修改指定区间的数据之后，求某一段区间的和 最大值 gcd...(可以根据划分的左右子区间的值推出整个区间的值的情况)

// 关于求【区间和】类题目，假设数据使用数组存放
// 1.数组不变，求区间和                                [前缀和] [树状数组] [线段树]
// 2.多次修改某个数，求区间和                           [树状数组] [线段树]
// 3.多次修改某个区间，输出最终结果                     [差分]
// 4.多次修改某个区间，求区间和                         [线段树] [树状数组](看修改区间范围)
// 5.多次将某个区间变成同一个数，求区间和                [线段树] [树状数组](看修改区间范围)


class Node {
    constructor() {
        this.left = this.right = null
        // val表示当前区间的区间和
        // add懒标记，表示当前节点对应的区间中的值是否需要更新了，add=0表示不需要更新
        this.val = this.add = 0
    }
}
let N = 100
class SegmentTree {
    constructor() {
        this.root = new Node()
    }
    // 在区间[start,end]中将区间[l,r]的值都更新为val
    update(node, start, end, l, r, val) {
        // 要修改的区间包含查询的区间
        // 更新区间的值时，只更新线段树上对应区间节点的值，而不更新具体单值叶子节点的值
        if (l <= start && end <= r) {
            // node对应的区间中有end - start + 1个节点，每个的值为val
            node.val = (end - start + 1) * val
            // 打上懒加载的标记，表示当前节点需要更新(没有实际更新)
            node.add = val
            return
        }
        let mid = start + end >> 1
        // 将需要更新的数字分别下传给左右子节点
        this.pushDown(node, mid - start + 1, end - mid)
        if (l <= mid) this.update(node.left, start, mid, l, r, val)
        if (r > mid) this.update(node.right, mid + 1, end, l, r, val)
        // 后序遍历，最后更新节点的值
        this.pushUp(node)
    }
    // 在[start,end]区间中查询[l,r]区间的和
    query(node,start,end,l,r) {
        if (l <= start && end <= r) return node.val
        let mid = start + end >> 1, ans = 0
        this.pushDown(node, mid - start + 1, end - mid)
        if (l <= mid) ans += this.query(node.left, start, mid, l, r)
        if (r > mid) ans += this.query(node.right, mid + 1, end, l, r)
        return ans
    }
    // 向上更新
    pushUp(node) {
        node.val = node.left.val + node.right.val
    }
    // leftNum 和 rightNum 表示左右孩子区间的叶子节点数量
    // 因为如果是「加减」更新操作的话，需要用懒惰标记的值✖️叶子节点的数量
    pushDown(node, leftNum, rightNum) {
        if (node.left == null) node.left = new Node()
        if (node.right == null) node.right = new Node()
        if (node.add == 0) return
        node.left.val = node.add * leftNum
        node.right.val = node.add * rightNum
        node.left.add = node.add
        node.right.add = node.add
        // 子节点已经更新了，取消节点的add懒更新标记
        node.add = 0
    }

}
let t = new SegmentTree()
let root = t.root
t.update(root,0, N, 10, 12, 12)
let r = t.query(root,0,N,10,12)
console.log(r,JSON.stringify(t,null,'\t'));