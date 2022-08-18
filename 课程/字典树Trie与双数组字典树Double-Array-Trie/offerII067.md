剑指 Offer II 067. 最大的异或

给定一个整数数组 nums ，返回 nums[i] XOR nums[j] 的最大运算结果，其中 0 ≤ i ≤ j < n 。

 

示例 1：

输入：nums = [3,10,5,25,2,8]
输出：28
解释：最大运算结果是 5 XOR 25 = 28.
```js
class Node {
    constructor() {
        this.num = 0
        this.next = Array(2).fill(null)
    }
}
// 二叉字典树
class Trie {
    constructor() {
        this.root = new Node()
    }
    insert(num) {
        let p = this.root
        for (let i = 30; i >= 0; i--) {
            let ind = num >> i & 1
            if (p.next[ind] == null) p.next[ind] = new Node()
            p = p.next[ind]
        }
        p.num = num
    }
    // 在字典树中找和当前数字二进制位尽可能不同位数最多的数字
    searchXOR(num) {
        let p = this.root
        for (let i = 30; i >= 0; i--) {
            let d = num >> i & 1, xor = d ^ 1
            // 为了使得异或和最大，尽可能找和当前二进制位相反的 节点
            // 如果，没有按照当前二进制位 继续向下找
            if (p.next[xor]) {
                p = p.next[xor]
            }else p = p.next[d]
        }
        return p.num
    }
}
var findMaximumXOR = function (nums) {
    // 把每个数字转化成二进制，将每一位插入到字典树中
    // 遍历每个数字，在字典树中找和当前数字二进制位尽可能不同位数最多的数字
    let tr = new Trie()
    for (let x of nums) {
        tr.insert(x)
    }
    let res = 0
    for (let x of nums) {
        res = Math.max(res, tr.searchXOR(x) ^ x)
    }
    return res
};