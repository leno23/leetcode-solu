剑指 Offer II 007. 数组中和为 0 的三个数

给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请

你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

 

 

示例 1：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
```js
var threeSum = function (nums) {
    nums.sort((a, b) => a - b)
    let ret = [], n = nums.length
    for (let i = 0; i + 2 < n; i++) {
        if (nums[i] > 0) break
        if (i > 0 && nums[i] == nums[i - 1]) continue
        let j = i + 1, k = n - 1
        while (j < k) {
            let sum = nums[i] + nums[j] + nums[k]
            if (sum == 0) {
                ret.push([nums[i], nums[j], nums[k]])
                // 三数之和只要保证两个数字不同，那么三元组就是不同的
                while (j < k && nums[j] == nums[j + 1]) j++
                j++
            } else if (sum > 0) k--
            else j++
        }
    }
    return ret
};
```