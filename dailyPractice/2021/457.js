/*
457. 环形数组是否存在循环

存在一个不含 0 的 环形 数组 nums ，每个 nums[i] 都表示位于下标 i 的角色
应该向前或向后移动的下标个数：

如果 nums[i] 是正数，向前 移动 nums[i] 步
如果 nums[i] 是负数，向后 移动 nums[i] 步
因为数组是 环形 的，所以可以假设从最后一个元素向前移动一步会到达第一个元素，
而第一个元素向后移动一步会到达最后一个元素。

数组中的 循环 由长度为 k 的下标序列 seq ：

遵循上述移动规则将导致重复下标序列 
seq[0] -> seq[1] -> ... -> seq[k - 1] -> seq[0] -> ...
所有 nums[seq[j]] 应当不是 全正 就是 全负
k > 1
如果 nums 中存在循环，返回 true ；否则，返回 false 。
*/
var circularArrayLoop = function (nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      continue;
    }
    let slow = i,
      fast = next(nums, i);
    // 判断非零且方向相同
    while (
      nums[slow] * nums[fast] > 0 &&
      nums[slow] * nums[next(nums, fast)] > 0
    ) {
      if (slow === fast) {
        if (slow !== next(nums, slow)) {
          return true;
        } else {
          break;
        }
      }
      slow = next(nums, slow);
      fast = next(nums, next(nums, fast));
    }
    let add = i;
    while (nums[add] * nums[next(nums, add)] > 0) {
      const tmp = add;
      add = next(nums, add);
      nums[tmp] = 0;
    }
  }
  return false;
};

const next = (nums, cur) => {
  const n = nums.length;
  return (((cur + nums[cur]) % n) + n) % n; // 保证返回值在 [0,n) 中
};
