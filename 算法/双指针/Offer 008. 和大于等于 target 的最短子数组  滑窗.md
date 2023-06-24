剑指 Offer II 008. 和大于等于 target 的最短子数组

中等

109

相关企业

给定一个含有 `n` ****个正整数的数组和一个正整数 `target` **。**

找出该数组中满足其和 ****`≥ target` ****的长度最小的 **连续子数组** `[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度 **。** 如果不存在符合条件的子数组，返回 `0` 。

 

**示例 1：**

```
输入： target = 7, nums = [2,3,1,2,4,3]
输出： 2
解释： 子数组 [4,3] 是该条件下的长度最小的子数组。
```

**示例 2：**

```
输入： target = 4, nums = [1,4,4]
输出： 1
```

```py
# 双指针
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n=len(nums)
        ret=10**9
        sm=0
        l=0
        # 计算以每个位置结尾的满足条件的子数组的个数
        for i in range(n):
            sm+=nums[i]
            while sm>=target:
                # 如果已经满足的话，缩小左边界，找更小的答案
                ret=min(ret,i-l+1)
                sm-=nums[l]
                l+=1
        if ret==10**9: return 0
        return ret
