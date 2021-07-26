/*
1713. 得到子序列的最少操作次数

给你一个数组 target ，包含若干 互不相同 的整数，
以及另一个整数数组 arr ，arr 可能 包含重复元素。

每一次操作中，你可以在 arr 的任意位置插入任一整数。
比方说，如果 arr = [1,4,1,2] ，那么你可以在中间添加 3 得到 
[1,4,3,1,2] 。你可以在数组最开始或最后面添加整数。

请你返回 最少 操作次数，使得 target 成为 arr 的一个子序列。

一个数组的 子序列 指的是删除原数组的某些元素（可能一个元素都不删除），同时不改变其余元素的相对顺序得到的数组。比方说，[2,7,4] 是 [4,2,3,7,2,1,4] 的子序列（加粗元素），但 [2,4,2] 不是子序列。

*/
/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {number}
 */
var minOperations = function (target, arr) {
  const map = target.reduce((pre, cur, ind) => {
    pre[cur] = ind;
    return pre;
  }, {});
  const inds = arr.filter((v) => map[v] !== undefined).map((v) => map[v]);

  // 求一个数组的最长递增子序列
  function lengthOfLIS(inds) {
    let ret = [];
    for (let i = 0; i < inds.length; i++) {
      if ((ret[ret.length - 1] || 0) < inds[i]) {
        ret.push(inds[i]);
      } else {
        let left = 0,
          right = ret.length - 1;
        while (left < right) {
          let mid = left + ((right - left) >> 1);
          if (ret[mid] >= inds[i]) {
            right = mid;
          } else {
            left = mid + 1;
          }
        }
        ret[left] = inds[i];
      }
    }
    return ret.length;
  }

  return target.length - lengthOfLIS(inds).length;
};
