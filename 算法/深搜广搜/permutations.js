/*
46. 全排列
给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
 
*/
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  // 记录在递归过程使用过的数字，结果数组
  const used = {}, ret = []
  // 深度递归+回溯
  function dfs(path) {
    // 路径和数组元素个数相同时，返回path引用的copy，因为后续变化时会出现异常
    if (nums.length == path.length) ret.push([...path])

    for (let num of nums) {
      // 若数字使用过，则跳过
      if (used[num]) continue
      // 标记数字使用过
      used[num] = true
      path.push(num) // 更新path
      dfs(path)
      // 去掉使用过的标记
      used[num] = false
      path.pop()
    }
  }
  dfs([])
  return ret

};