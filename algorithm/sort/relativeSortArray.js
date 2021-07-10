/*
  1122. 数组的相对排序

  给你两个数组，arr1 和 arr2，

  arr2 中的元素各不相同
  arr2 中的每个元素都出现在 arr1 中
  对 arr1 中的元素进行排序，使 arr1 中项的相对顺序和 arr2 中的相对顺序相同。未在 arr2 中出现过的元素需要按照升序放在 arr1 的末尾。

  示例：
  输入：arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]
  输出：[2,2,2,1,4,3,3,9,6,7,19]

*/

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number[]}
 */
// 使用计数排序方法处理
 var relativeSortArray = function (arr1, arr2) {
  // 将arr1中和arr2中相同的元素按照arr2的顺序排列，不包含的升序排在结尾
  // cnt记录每个数字的个数
  let cnt = Array(1003).fill(0)
  // 统计每个数字出现的个数
  for (let x of arr1) cnt[x]++
  // arr2中的数字放入到arr1中的位置，因为需要按照arr2的顺序排序
  // 所以从头开始放
  let k = 0;  
  // 遍历arr2，在arr1生成的数字次数数组中找，如果cnt[x]不为零，
  // 则表示x数字也在arr1中，则直接放入到arr1中
  for (let x of arr2) while (cnt[x]--) arr1[k++] = x
  // 处理arr1中不在arr2中数字
  // 正序遍历，保证放入的数字从小到大排列，位置接着上面的k
  for (let i = 0; i < 1001; i++) {
      // 此处小于零是因为在17行，将arr2中的数字放入到arr1后，对应数字的次数变为了-1
      if (cnt[i] <= 0) continue
      // 将其他的数字逐个放到arr1的结尾，直到个数为0
      while (cnt[i]--) arr1[k++] = i
  }
  return arr1
};