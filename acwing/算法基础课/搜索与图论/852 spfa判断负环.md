852. spfa判断负环

给定一个 n� 个点 m� 条边的有向图，图中可能存在重边和自环， **边权可能为负数**。

请你判断图中是否存在负权回路。

#### 输入格式

第一行包含整数 n� 和 m�。

接下来 m� 行每行包含三个整数 x,y,z�,�,�，表示存在一条从点 x� 到点 y� 的有向边，边长为 z�。

#### 输出格式

如果图中**存在**负权回路，则输出 `Yes`，否则输出 `No`。

#### 数据范围

1≤n≤20001≤�≤2000,  
1≤m≤100001≤�≤10000,  
图中涉及边长绝对值均不超过 1000010000。

#### 输入样例：

```
3 3
1 2 -1
2 3 4
3 1 -4
```

#### 输出样例：

```
Yes
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
# cnt[j] 从起点到j点经过的边数
cnt=[0]*(n+1)
# 队列中存放更新了的点，st[i]表示i点是否在队列中
st=[0]*(n+1)

def spfa():
    # 1点为起点
    dist[1]=0
    q=[]
    # 负环的起点有可能是1~n中任意一个点
    for i in range(1,n+1): q.append(i)
    st[1]=1
    while q:
        tmp=q
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
                    cnt[j]=cnt[t]+1
                    if cnt[j]>=n: return 'Yes'
                    # 防止重复添加
                    if not st[j]:
                        q.append(j)
                        st[j]=t
                # print(dist)
                # 尝试下一条路径
                i=ne[i]
    return 'No'
print(spfa())
