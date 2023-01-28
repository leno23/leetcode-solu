链接：<https://ac.nowcoder.com/acm/problem/23486>  
来源：牛客网  
  


## 题目描述[](<> "只看题目描述")[](<> "收起全屏，编写代码")

小A与小B这次两个人都被困在了迷宫里面的两个不同的位置，而他们希望能够迅速找到对方，然后再考虑如何逃离迷宫的事情。小A每次可以移动一个位置，而小B每次可以移动两次位置，小A移动的方向是上下左右左上左下右上右下8个方向，小B移动的方向是上下左右4个方向，请问他们最早什么时候能够找到对方，如果他们最终无法相遇，那么就输出”NO"。  


## 输入描述:

```
第一行两个整数N，M分别表示迷宫的行和列。接下来一个N×M的矩阵其中"C"表示小A的位置,"D"表示小B的的位置，"＃"表示不可通过的障碍，"."则是可以正常通过的位置。字符用空格隔开第一行两个整数N，M分别表示迷宫的行和列。\
接下来一个N\times M 的矩阵\其中"C"表示小A的位置,"D"表示小B的的位置，\
"＃"表示不可通过的障碍，"."则是可以正常通过的位置。\字符用空格隔开\第一行两个整数N，M分别表示迷宫的行和列。接下来一个N×M的矩阵其中"C"表示小A的位置,"D"表示小B的的位置，"＃"表示不可通过的障碍，"."则是可以正常通过的位置。字符用空格隔开
```

## 输出描述:

```
如果可以相遇，第一行输出一个YES，第二行一个整数输出最短的相遇时间。
否则就输出一个NO表示不能相遇。
```

示例1

## 输入


```
4 5
. . . . .
. # # # .
. . . # D
. . C # .
```

## 输出


```
YES
3
```

## 备注:

```
1≤n,m≤10001 \leq n,m \leq 10001≤n,m≤1000
```

```py
from collections import deque

n,m=[int(x) for x in input().split()]
# 方向数组
dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]
g=[['']*m for i in range(n)]
# vis[t][i][j] 表示小a或者小b 是否经过了i,j点
vis = [[[0]*m for i in range(n)] for _ in range(2)]
q=[deque() for i in range(2)]
for i in range(n):
    r=[x for x in input().split()]
    for j in range(m):
        if r[j]=='C':
            q[0].append([i,j])
            vis[0][i][j]=1
        if r[j]=='D':
            q[1].append([i,j])
            vis[1][i][j]=1
        g[i][j]=r[j]

def bfs(t):
    for _ in range(len(q[t])):
        i,j=q[t].popleft()
        for k in range(4 if t else 8):
            dx,dy=dirs[k]
            x,y=i+dx,j+dy
            if x<0 or x>=n or y<0 or y>=m or vis[t][x][y] or g[x][y]=='#': continue
            if vis[1-t][x][y]: return 1
            vis[t][x][y]=1
            q[t].append([x,y])
    return 0
def sol():
    res = 0
    while len(q[0]) or len(q[1]):
        res+=1
        # 小a一次走一步 小b一次走两步
        if bfs(0): return res
        if bfs(1): return res
        if bfs(1): return res
    return -1
ans = sol()
if ans==-1: print('NO')
else:
    print('YES')
    print(ans)