```py
class Solution:
    def rampartDefensiveLine(self, arr: List[List[int]]) -> int:
        # 扩张k个单位会不会有重叠
        n=len(arr)
        # 是否可以满足不重叠的条件
        def check(k):
            # 左边剩余的空间
            ls=arr[1][0]-arr[0][1]
            for i in range(1,n-1):
                left= arr[i][0]-arr[i-1][1]
                right=arr[i+1][0]-arr[i][1]
                
                if ls>=k: ls=right
                else: ls=ls+right-k
                if ls<0: return 0
            return 1
        # 二分第一个不满足条件的有重叠的k
        #   k     1  3  5  7  8  
        #  check  1  1  1  1  0
        l,r=1,10**8
        while l<r:
            mid=l+r>>1
            if check(mid): l=mid+1
            else:r=mid
        # 结果取满足条件不重叠时的最大k
        return l-1
```
