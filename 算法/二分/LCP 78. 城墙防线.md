```py
class Solution:
    def rampartDefensiveLine(self, arr: List[List[int]]) -> int:
        # 扩张k个单位会不会有重叠
        n=len(arr)
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
        # 二分第一个有重叠的k
        l,r=1,10**8
        while l<r:
            mid=l+r>>1
            if check(mid): l=mid+1
            else:r=mid
        return l-1
```
