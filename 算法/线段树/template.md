```js
// 线段树 动态开点
class Node {
    constructor() {
        this.left = this.right = null
        this.val = this.lazy = 0
    }
}
let N = 1e9
class SegTree {
    constructor() {
        this.root = new Node()
    }
    query(l,r){
        return this._query(this.root, 0, N, l, r)
    }
    _query(node, left, right, l, r) {
        if (l <= left && right <= r) return node.val
        this.pushDown(node)
        let mid = left + right >> 1
        let res = 0
        if (l <= mid) res = this._query(node.left, left, mid, l, r)
        if (r > mid) res = Math.max(res, this._query(node.right, mid + 1, right, l, r))
        return res
    }
    pushDown(node) {
        if (node.left == null) node.left = new Node()
        if (node.right == null) node.right = new Node()
        if (node.lazy == 0) return
        node.left.val += node.lazy
        node.right.val += node.lazy
        node.left.lazy += node.lazy
        node.right.lazy = node.lazy
        node.lazy = 0
    }
    pushUp(node) {
        node.val = Math.max(node.left.val, node.right.val)
    }
    update(l,r,val){
        this._update(this.root, 0, N, l, r, val)
    }
    _update(node, left, right, l, r, val) {
        if (l <= left && right <= r) {
            node.val += val
            node.lazy += val
            return
        }
        this.pushDown(node)
        let mid = left + right >> 1
        if (l <= mid) this._update(node.left, left, mid, l, r, val)
        if (r > mid) this._update(node.right, mid + 1, right, l, r, val)
        this.pushUp(node)
    }
}