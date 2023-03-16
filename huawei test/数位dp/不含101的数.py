'''
题目描述 
小明在学习二进制时，发现了一类不含 101的数，也就是： 
将数字用二进制表示，不能出现 101 。 
现在给定一个整数区间 [l,r] ，请问这个区间包含了多少个不含 101 的数？ 
输入描述 
输入的唯一一行包含两个正整数 l， r（ 1 ≤ l ≤ r ≤ 10^9）。 
输出描述 
输出的唯一一行包含一个整数，表示在 [l,r] 区间内一共有几个不含 101 的数。 
示例 1 
输入： 1 10 输出： 
8 
 
 示例说明： 区间 [1,10] 内， 5 的二进制表示为 101 ，10的二进制表示为 1010 ，因此区间 [ 1 , 10 ] 内有 10−2=8 个不含 101的数。 
 
示例2 
输入： 10 20 输出： 
7 
 
 示例说明： 区间 [10,20] 内，满足条件的数字有 [12,14,15,16,17,18,19] 因此答案为 7。 
 '''
# 算法实现
# def dfs(p, limit, f, arr, pre, prepre):
#     if p == len(arr):
#         return 1
 
#     if not limit and f[p][pre][prepre] > 0:
#         return f[p][pre][prepre]
 
#     maxV = arr[p] if limit else 1
#     count = 0
 
#     for i in range(maxV + 1):
#         if i == 1 and pre == 0 and prepre == 1:
#             continue
#         count += dfs(p + 1, limit and i == maxV, f, arr, i, pre)
 
#     if not limit:
#         f[p][pre][prepre] = count
 
#     return count
 
 
# def digitSearch(num):
#     arr = list(map(int, list(format(num, 'b'))))
#     f = [[[0, 0] for j in range(2)] for i in range(len(arr))]
#     return dfs(0, True, f, arr, 0, 0)
 
 
# # 输入获取
# L, R = map(int, input().split())
 
# # 算法调用
# print(digitSearch(R) - digitSearch(L - 1))

# 第p-2位是prepre 第p-1位是pre，而且第p位没有到上界的不含101的二进制数的个数
# f[p][pre][prepre]
def dfs(p,limit,f,arr,pre,prepre):
    if p==len(arr): return 1
    if not limit and f[p][pre][prepre]: return f[p][pre][prepre]
    mx=1
    if limit: mx=arr[p]
    count=0
    for i in range(mx+1):
        if i==1 and pre==0 and prepre==1: continue
        count += dfs(p+1,limit and i==mx,f,arr,i,pre)
    if not limit: f[p][pre][prepre]=count
    return count

def get(x):
    arr=[]
    while x:
        arr.append(x%2)
        x //=2
    arr.reverse()
    f=[[[0]*2 for i in range(len(arr))] for j in range(len(arr))]
    return dfs(0,1,f,arr,0,0)
a,b=[int(x) for x in input().split()]
print(get(b)-get(a-1))