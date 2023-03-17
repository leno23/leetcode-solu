'''

                    题目描述 
某地有N个广播站，站点之间有些有连接，有些没有。有连接的站点在接受到广播后会互相发送。 
给定一个N*N的二维数组matrix,数组的元素都是字符’0’或者’1’。 
matrix[i][j] = ‘1’, 代表i和j站点之间有连接， 
matrix[i][j] = ‘0’, 代表没连接， 
现在要发一条广播，问初始最少给几个广播站发送，才能保证所有的广播站都收到消息。 
 
输入描述 
从stdin输入，共一行数据，表示二维数组的各行，用逗号分隔行。保证每行字符串所含的字符数一样的。 
比如：110,110,001。 
 
输出描述 
返回初始最少需要发送广播站个数 
 
用例 
输入
110,110,001
输出
2
说明站点1和站点2直接有连接，站点3和其他的都没连接，所以开始至少需要给两个站点发送广播。


输入 
100,010,001 
输出
3
说明3台服务器互不连接，所以需要分别广播这3台服务器。


输入 
11,11
输出
1
说明2台服务器相互连接，所以只需要广播其中一台服务器
 
'''
g=[]
for row in input().split(','):
    g.append([int(x) for x in row])
n=len(g)
count=n
q=[0]*n
for i in range(n): q[i]=i
def find(x):
    if q[x]!=x: q[x]=find(q[x])
    return q[x]
def merge(a,b):
    global count
    fa,fb=find(a),find(b)
    if fa!=fb:
        q[fa]=fb
        count-=1
for i in range(n):
    for j in range(i+1,n):
        if g[i][j]: merge(i,j)
print(count)