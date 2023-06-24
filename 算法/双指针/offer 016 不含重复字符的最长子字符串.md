剑指 Offer II 016. 不含重复字符的最长子字符串

中等

77

相关企业

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长连续子字符串** 的长度。

 

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子字符串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子字符串是 "b"，所以其长度为 1。
```

```py
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        mp=Counter()
        n=len(s)
        ret=0
        l=0
        for i in range(n):
            mp[s[i]]+=1
            while mp[s[i]]>1:
                mp[s[l]]-=1
                l+=1
            ret=max(ret,i-l+1)
        return ret