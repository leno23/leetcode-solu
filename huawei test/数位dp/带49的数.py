'''
题目描述
求区间 [1,n] 范围内包含多少带 49 的数。

一个数是带 49 的数，当且仅当它的十进制表示中存在连续的两位，其中较高位为 4，较低位为 9。

比如：49, 149, 1234987 都是带 49 的数；

而 4, 12345, 94, 999444 都不是。

输入描述
输入一个整数 n (1 ≤ n < 2^63)。

输出描述
输出一个整数，表示区间 [1, n] 范围内存在多少带 49 的数。

输入
500

输出
15
'''
def func(num):
    arr=[int(x) for x in num]
    n=len(arr)
    # f[i][pre]第i-1位是pre，而且pre不是上界的，不包含49的数字个数
    f=[[0]*10 for i in range(n)]
    # 0~num中不包含49的数字个数
    def dfs(p,limit,pre):
        # 一直遍历所有位都没有返回，说明当前路径对应的数字中不含49，记下一个数量
        if p==n: return 1
        # 如果有上界的话，pre后的第i位的取值范围不同，结果可能不同
        if not limit and f[p][pre]: return f[p][pre]
        mx = 9
        if limit: mx=arr[p]
        count=0
        for i in range(mx+1):
            if i==9 and pre==4: continue
            count += dfs(p+1,limit and i==mx,i)
        if not limit: f[p][pre]=count
        return count
    # dfs计算不包含49的数字个数，把0算进去了，多减掉了一个不是49的数字，这里需要加回去
    return int(num) + 1 - dfs(0,1,0)
print(func(input()))