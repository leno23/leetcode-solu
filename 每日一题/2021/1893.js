/*
1893. 检查是否区域内所有整数都被覆盖

给你一个二维整数数组 ranges 和两个整数 left 和 right 。
每个 ranges[i] = [starti, endi] 表示一个从 starti 到 endi 的 闭区间 。

如果闭区间 [left, right] 内每个整数都被 ranges 中 至少一个 区间覆盖，
那么请你返回 true ，否则返回 false 。

已知区间 ranges[i] = [starti, endi] ，如果整数 x 满足 starti <= x <= endi ，
那么我们称整数x 被覆盖了。

*/
/**
 * @param {number[][]} ranges
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
var isCovered = function (ranges, left, right) {
  let diff = Array(52).fill(0); // 差分数组
  for (let range of ranges) {
    ++diff[range[0]];
    --diff[range[1] + 1];
  }
  // 前缀和
  let curr = 0;
  for (let i = 1; i <= 50; ++i) {
    curr += diff[i];
    if (i >= left && i <= right && curr <= 0) {
      return false;
    }
  }
  return true;
};
