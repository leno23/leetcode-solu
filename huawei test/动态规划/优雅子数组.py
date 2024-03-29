'''
题目描述 
如果一个数组中出现次数最多的元素出现大于等于K次，被称为 k-优雅数组 ，k也可以被称为优雅阈值。 例如，数组1，2，3，1、2，3，1，它是一个3-优雅数组，因为元素1出现次数大于等于3次， 数组[1, 2, 3, 1, 2]就不是一个3-优雅数组，因为其中出现次数最多的元素是1和2，只出现了2次。 
给定一个数组A和k，请求出A有多少子数组是k-优雅子数组。 
子数组是数组中一个或多个连续元素组成的数组。 
例如，数组[1,2,3,4]包含10个子数组，分别是： [1], [1,2], [1,2,3], [1,2,3,4], [2], [2,3], [2,3,4], [3], [3, 4], [4]。 
 
输入描述 
第一行输入两个数字，以空格隔开，含义是：A数组长度 k值 
第二行输入A数组元素，以空格隔开 
 
输出描述 
输出A有多少子数组是k-优雅子数组 
 
用例 
输入
7 3
1 2 3 1 2 3 1
输出
1

说明
无
输入
7 2
1 2 3 1 2 3 1

输出
10
说明无
'''
n,k=map(int,input().split())
A=[int(x) for x in input().split()]
mp={}
for x in A: mp[x]=0
l,r=0,0
res=0
while l<n and r<n:
    mp[A[r]]+=1
    # 从l向后枚举时，如果l~r段的最大的数字num出现个数刚好为k，那么num必然是最右边的数字
    # 所以只需要判断新进入的数字的出现次数是否 >=k,如果满足，则此时l~r段就是以l开头的最短满足条件的子数组
    # 右边的r-1~n-1也同样满足
    if mp[A[r]]>=k:
        # 此时以l为左边界，以r-1~n-1为右边界的子数组都符合条件
        res += n-r
        mp[A[l]]-=1
        l+=1
        '''
        例如
        7 2
        1 2 3 1 2 3 1
        1 2 3 1  是以0开头的最短的优雅子数组
        在l向后移动一位时，j应该至少从r开始才有可能出现另外一个优雅子数组
        由于每次都会向后加入一个新数字，这里不需要r向后移动，所以向前移动一位
        '''
        mp[A[r]]-=1
        r-=1
    r+=1
print(res)
