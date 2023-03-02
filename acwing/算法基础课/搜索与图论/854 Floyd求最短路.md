854. Floyd求最短路

-   [   题目](https://www.acwing.com/problem/content/description/856/)
-   [   提交记录](https://www.acwing.com/problem/content/submission/856/)
-   [   讨论](https://www.acwing.com/problem/content/discussion/index/856/1/)
-   [   题解](https://www.acwing.com/problem/content/solution/856/1/)
-   [   视频讲解](https://www.acwing.com/problem/content/video/856/)

  


给定一个 n� 个点 m� 条边的有向图，图中可能存在重边和自环，边权可能为负数。

再给定 k� 个询问，每个询问包含两个整数 x� 和 y�，表示查询从点 x� 到点 y� 的最短距离，如果路径不存在，则输出 `impossible`。

数据保证图中不存在负权回路。

#### 输入格式

第一行包含三个整数 n,m,k�,�,�。

接下来 m� 行，每行包含三个整数 x,y,z�,�,�，表示存在一条从点 x� 到点 y� 的有向边，边长为 z�。

接下来 k� 行，每行包含两个整数 x,y�,�，表示询问点 x� 到点 y� 的最短距离。

#### 输出格式

共 k� 行，每行输出一个整数，表示询问的结果，若询问两点间不存在路径，则输出 `impossible`。

#### 数据范围

1≤n≤2001≤�≤200,  
1≤k≤n21≤�≤�2  
1≤m≤200001≤�≤20000,  
图中涉及边长绝对值均不超过 1000010000。

#### 输入样例：

```
3 3 2
1 2 1
2 3 2
1 3 1
2 1
1 3
```

#### 输出样例：

```
impossible
1
```

```py
n,m,k=[int(x) for x in input().split()]

d=[[0x3f3f3f3f]*(n+1) for i in range(n+1)]
def floyd():
    # d[k][i][j]从i到j经过1~k这些点的最短距离
    # 从i到j经过1~k点的距离 = 从i到k经过1~k-1点的距离 + 从k到j经过1~k-1点的距离
    # d[k][i][j]=  d[k-1][i][k] + d[k-1][k][j]
    # k只和k-1项有关，可以优化掉
    for k in range(1,n+1):
        for i in range(1,n+1):
            for j in range(1,n+1):
                d[i][j]=min(d[i][j],d[i][k]+d[k][j])
                
for i in range(1,n+1): d[i][i]=0

for i in range(m):
    a,b,w=[int(x) for x in input().split()]
    d[a][b]=min(d[a][b],w)
    
floyd()
for i in range(k):
    a,b=[int(x)for x in input().split()]
    if d[a][b]>0x3f3f3f3f/2: print('impossible')
    else: print(d[a][b])
    
    
    
    