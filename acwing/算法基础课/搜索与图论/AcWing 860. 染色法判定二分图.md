860. 染色法判定二分图

-   [   题目](https://www.acwing.com/problem/content/description/862/)
-   [   提交记录](https://www.acwing.com/problem/content/submission/862/)
-   [   讨论](https://www.acwing.com/problem/content/discussion/index/862/1/)
-   [   题解](https://www.acwing.com/problem/content/solution/862/1/)
-   [   视频讲解](https://www.acwing.com/problem/content/video/862/)

  


给定一个 n� 个点 m� 条边的无向图，图中可能存在重边和自环。

请你判断这个图是否是二分图。

#### 输入格式

第一行包含两个整数 n� 和 m�。

接下来 m� 行，每行包含两个整数 u� 和 v�，表示点 u� 和点 v� 之间存在一条边。

#### 输出格式

如果给定图是二分图，则输出 `Yes`，否则输出 `No`。

#### 数据范围

1≤n,m≤1051≤�,�≤105

#### 输入样例：

```
4 4
1 3
1 4
2 3
2 4
```

#### 输出样例：

```
Yes
```

```py
# bfs遍历染色，给相邻结点染上相反颜色，二分图二染色，对应颜色1和2
# 队列维护每次染色过程中可以染色的结点

n, m = map(int, input().split())

g = [[]for i in range(n+1)]

for _ in range(m):
    a, b = [int(x) for x in input().split()]
    g[a].append(b)
    g[b].append(a)

color = [0] * (n + 1)  # 0表示未染色

def bfs(u):
    color[u] = 1
    q = [[u,1]]
    while q:
        tmp=q
        q=[]
        for t,c in tmp:
            for v in g[t]:
                 # 相邻节点不能颜色相同
                if color[v] == c:  return 0
                if not color[v]:
                    color[v] = 3 - c
                    q.append([v, 3-c])
    return 1
def sol():
    for i in range(1, n + 1):
        # 染色失败
        if not color[i] and not bfs(i):
            return 'No'
    return 'Yes'

print(sol())

