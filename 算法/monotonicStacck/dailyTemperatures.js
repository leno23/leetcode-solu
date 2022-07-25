/*
739. 每日温度

请根据每日 气温 列表 temperatures ，请计算在每一天需要等几天才会有更高的温度。
如果气温在这之后都不会升高，请在该位置用 0 来代替。
*/
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
// 原题即求，每个数与右边第一个比它大的数字的距离组成的数组
var dailyTemperatures = function (temperatures) {
  let s = [], ret = Array(temperatures.length).fill(0)
  for (let i = 0; i < temperatures.length; i++) {
    const temp = temperatures[i]
    while (s.length && temperatures[s[s.length - 1]] < temp) {
      ret[s[s.length - 1]] = i - s.pop()
    }
    s.push(i)
  }
  return ret
};