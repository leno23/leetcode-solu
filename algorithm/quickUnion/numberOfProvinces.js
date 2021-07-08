/*

  547. 省份数量

  有 n 个城市，其中一些彼此相连，另一些没有相连。如果城市 a 与城市 b 直接相连，且城市 b 与城市 c 直接相连，那么城市 a 与城市 c 间接相连。
  省份 是一组直接或间接相连的城市，组内不含其他没有相连的城市。
  给你一个 n x n 的矩阵 isConnected ，其中 isConnected[i][j] = 1 表示第 i 个城市和第 j 个城市直接相连，而 isConnected[i][j] = 0 表示二者不直接相连。
  返回矩阵中 省份 的数量。
*/

/**
 * @param {number[][]} isConnected
 * @return {number}
 */
//  并查集模板
class quickUnion {
  constructor(n) {
    // 初始化容量n+1，将元素染成下标值的颜色
    this.fa = Array(n + 1).fill().map((_, ind) => ind)
  }
  get(x) {
    // 扁平化处理，将相同颜色的点挂在同一个父节点(颜色)下面
    if (this.fa[x] == x) {
      this.fa[x] = x
    } else {
      this.fa[x] = this.get(this.fa[x])
    }
    return this.fa[x]
  }
  // 将b的颜色染成a的颜色
  merge(a, b) {
    this.fa[this.get(a)] = this.get(b)
  }
}
var findCircleNum = function (isConnected) {
  const n = isConnected.length
  // 并查集初始化
  let u = new quickUnion(n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // 满足联通体条件，则进行merge
      if (isConnected[i][j]) u.merge(i, j)
    }
  }
  let cnt = 0
  for (let i = 0; i < n; i++) {
    // 颜色为下标值i，
    // [[1,1,0],[1,1,0],[0,0,1]] -》 quickUnion { fa: [ 1, 1, 2 3] }
    //                                      对应下标为   0  1  2 
    // 同一种颜色，则cnt+1
    if (u.get(i) == i) cnt++
  }
  return cnt
};