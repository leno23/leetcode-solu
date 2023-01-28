51. 数字排列


输入一组数字（可能包含重复数字），输出其所有的排列方式。

#### 数据范围

输入数组长度 [0,6][0,6]。

#### 样例

```
输入：[1,2,3]

输出：
      [
        [1,2,3],
        [1,3,2],
        [2,1,3],
        [2,3,1],
        [3,1,2],
        [3,2,1]
      ]
```
剪枝逻辑
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65321c3dae9c467ab27fb0d9d147a8f0~tplv-k3u1fbpfcp-watermark.image)
剪掉用过的和上一个一样的数字，而且这个没有使用过


```py
class Solution:
    def permutation(self, nums):
        n=len(nums)
        r=[]
        vis=[0]*n
        nums.sort()
        def dfs(path):
            if len(path)==n:
                r.append([x for x in path])
                return
            for i in range(n):
                if i>0 and not vis[i-1] and nums[i]==nums[i-1]: continue
                path.append(nums[i])
                vis[i]=1
                dfs(path)
                path.pop()
                vis[i]=0
                
        dfs([])
        return r
                
        