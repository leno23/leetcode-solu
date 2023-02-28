851. spfa求最短路

-   [   题目](https://www.acwing.com/problem/content/description/853/)
-   [   提交记录](https://www.acwing.com/problem/content/submission/853/)
-   [   讨论](https://www.acwing.com/problem/content/discussion/index/853/1/)
-   [   题解](https://www.acwing.com/problem/content/solution/853/1/)
-   [   视频讲解](https://www.acwing.com/problem/content/video/853/)

  


给定一个 n� 个点 m� 条边的有向图，图中可能存在重边和自环， **边权可能为负数**。

请你求出 11 号点到 n� 号点的最短距离，如果无法从 11 号点走到 n� 号点，则输出 `impossible`。

数据保证不存在负权回路。

#### 输入格式

第一行包含整数 n� 和 m�。

接下来 m� 行每行包含三个整数 x,y,z�,�,�，表示存在一条从点 x� 到点 y� 的有向边，边长为 z�。

#### 输出格式

输出一个整数，表示 11 号点到 n� 号点的最短距离。

如果路径不存在，则输出 `impossible`。

#### 数据范围

1≤n,m≤1051≤�,�≤105,  
图中涉及边长绝对值均不超过 1000010000。

#### 输入样例：

```
3 3
1 2 5
2 3 -3
1 3 4
```

#### 输出样例：

```
2
```

```py
from heapq import heappush,heappop
n,m=[int(x) for x in input().split()]
h,e,ne,w=[-1]*(n+1),[0]*(m+1),[0]*(m+1),[0]*(m+1)
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
# dist[i] i点离起点的最短路径
dist=[0x3f3f3f3f]*(n+1)
# 队列中存放更新了的点，st[i]表示i点是否在队列中
st=[0]*(n+1)

def spfa():
    # 1点为起点
    dist[1]=0
    q=[1]
    st[1]=1
    while q:
        tmp=q
        print(tmp,w)
        q=[]
        for t in tmp:
            st[t]=0
            # h[t] 以t点为起点的所有边组成的链表的第一条边的编号
            i=h[t]
            while i!=-1:
                # j为第i条边的终点
                j=e[i]
                # 如果从当前边从t到达j点的距离dist[t]+w[i]小于dist[j],就更新dist[j]
                if dist[j]>dist[t]+w[i]:
                    dist[j]=dist[t]+w[i]
                    # 防止重复添加
                    if not st[j]:
                        q.append(j)
                        st[j]=t
                # print(dist)
                # 尝试下一条路径
                i=ne[i]
    if dist[n]==0x3f3f3f3f: return 'impossible'
    return dist[n]
print(spfa())
