850. Dijkstra求最短路 II

-   [   题目](https://www.acwing.com/problem/content/description/852/)
-   [   提交记录](https://www.acwing.com/problem/content/submission/852/)
-   [   讨论](https://www.acwing.com/problem/content/discussion/index/852/1/)
-   [   题解](https://www.acwing.com/problem/content/solution/852/1/)
-   [   视频讲解](https://www.acwing.com/problem/content/video/852/)

  


给定一个 n� 个点 m� 条边的有向图，图中可能存在重边和自环，所有边权均为非负值。

请你求出 11 号点到 n� 号点的最短距离，如果无法从 11 号点走到 n� 号点，则输出 −1−1。

#### 输入格式

第一行包含整数 n� 和 m�。

接下来 m� 行每行包含三个整数 x,y,z�,�,�，表示存在一条从点 x� 到点 y� 的有向边，边长为 z�。

#### 输出格式

输出一个整数，表示 11 号点到 n� 号点的最短距离。

如果路径不存在，则输出 −1−1。

#### 数据范围

1≤n,m≤1.5×1051≤�,�≤1.5×105,  
图中涉及边长均不小于 00，且不超过 1000010000。  
数据保证：如果最短路存在，则最短路的长度不超过 109109。

#### 输入样例：

```
3 3
1 2 2
2 3 1
1 3 4
```

#### 输出样例：

```
3
```

```py
from heapq import heappush,heappop
n,m=[int(x) for x in input().split()]
h,e,ne,w=[-1]*(m+1),[0]*(m+1),[0]*(m+1),[0]*(m+1)
idx=0
def add(a,b,c):
    global idx
    w[idx]=c
    e[idx]=b
    ne[idx]=h[a]
    h[a]=idx
    idx+=1
for i in range(m):
    a,b,c=[int(x)for x in input().split()]
    add(a,b,c)
dist=[0x3f3f3f3f]*(n+1)
st=[0]*(n+1)
def dijkstra():
    q=[]
    heappush(q,[0,1])
    while q:
        d,t=heappop(q)
        if st[t]:continue
        st[t]=1
        dist[t]=d
        i=h[t]
        while i!=-1:
            j=e[i]
            if dist[j]>d+w[i]:
                heappush(q,[d+w[i],j])
            i=ne[i]
    if dist[n]==0x3f3f3f3f: return -1
    return dist[n]

print(dijkstra())
    