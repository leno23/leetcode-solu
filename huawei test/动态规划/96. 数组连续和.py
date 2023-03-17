'''
标题：数组连续和|时间限制：1s|内存限制：65536k|语言限制：不限
给定一个含有N个正整数的数组，求出有多少个连续区间（包括单个正整数），他们的和大于等于x。
输入描述
第一行两个整数N x （0<N<=100000,0<=x<=10000000）
第二行有N个正整数（每个正整数小于等于100）。
输出描述
输出一个整数，表示所求的个数
示例1
输入
3 7
3 4 7
输出
4
说明
3+4 4+7 3+4+7 7 这四组数据都是大于等于7 的，所以答案为4
示例2
输入
10 10000000
1 2 3 4 5 6 7 8 9 10 
输出
0
'''
n,x=map(int,input().split())
arr = [int(x) for x in input().split()]
pre=[0]*n
# pre前缀和 以第i项结尾的最大和
pre[0]=arr[0]
for i in range(1,n): pre[i]=pre[i-1]+arr[i]
cnt=0
for i in range(n):
    if pre[i]==x: cnt+=1
    if pre[i]>x:
        # 从i到0枚举所有开始位置start，看start~i区间数字和是否满足
        for start in range(i,-1,-1):
            # start~i项的和
            sm=pre[i]
            if start>0: sm-=pre[start-1]
            if sm>=x:
                cnt+=start+1
                break
print(cnt)

