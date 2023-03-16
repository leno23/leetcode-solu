'''
题目描述 
给定一个m * n的矩阵一，由若干字符X和O构成，X表示该处已被占据，О表示该处空闲，请找到最大的单入口空闲区域。 
空闲区域是由连通的О组成的区域，位于边界的О可以构成入口，单入口空闲区域即有且只有一个位于边界的О作为入口的由连通的О组成的区域。 
如果两个元素在水平或垂直方向相邻，则称它们是“连通”的。 
输入描述 
第一行输入为两个数字： 第一个数字为行数m，第二个数字为列数n，两个数字以空格分隔，1 ≤m,n ≤200； 剩余各行为矩阵各行元素，元素为X或O，各元素间以空格分隔。 
输出描述 
若有唯一符合要求的最大单入口空闲区域，输出三个数字： 第一个数字为入口行坐标(范围为0~行数-1)； 第二个数字为入口列坐标（范围为0~列数-1) ； 第三个数字为区域大小，三个数字以空格分隔； 若有多个符合要求的最大单入口空闲区域，输出一个数字，代表区域的大小； 若没有，输出NULL。 
示例 1 
输入： 
4 4 
X X X X 
X O O X 
X O O X 
X O X X 
输出： 
3 1 5 


示例 2 
输入： 
4 5 
X X X X X 
O O O O X 
X O O O X 
X O X X O 
输出： 
3 4 1  


示例 3 
输入： 
5 4 
X X X X 
X O O O 
X O O O 
X O O X 
X X X X 
输出： 
NULL 
 
 说明： 只有一个空闲区域，但是空闲区域有两个入口，所有输出NULL 
 
示例 4 
输入： 
5 4 
X X X X 
X O O O 
X X X X 
X O O O 
X X X X 
输出： 
3 
 
 说明： 有两个空闲区域，入口坐标分别四 1,3 和 3,3 ，空闲区域大小都是3，所以输出3。 
'''
'''
思路：
使用并查集将当前的O点和上一列和上一行的O点连接
并维护每个点所在连通块的三个信息
1.每个点所在的连通块的id,连通块id是从按顺序的第一个元素的id
2.每个连通块中位于边界上的点的数量
3.每个连通块的边界点的坐标
'''
n,m=[int(x) for x in input().split()]
g=[]
for i in range(n):  g.append(input().split())
# 每个点所在连通块id
q=[0]*(n*m)
# 每个点默认单独是一个连通块，id是字符从上到下从左到右数的序号
for i in range(n*m): q[i]=i
# cnt 每个点所在连通块的元素数量 cnt2 每个点所在连通块中边界元素的数量 cnt3 每个联通块的边界点的坐标
cnt,cnt2,cnt3=[1]*(n*m),[0]*(n*m),{}

# 查找每个点所在连通块id
def find(x):
    if q[x]!=x: q[x]=find(q[x])
    return q[x]

# 检查一个点是否在边界
def check(i,j):
    return i==0 or i==n-1 or j==0 or j==m-1

# 如果ab不在同一个联通块，**将a合入到b的连通块中
def merge(a,b):
    fa,fb=find(a),find(b)
    if fa==fb: return
    # 合入的点a是否是边界点
    if check(a//m,a%m):
        cnt2[fb]+=1  #更新b所在连通块的边界点的数量
        # 如果只有一个边界点的话，才记录下当前连通块的边界点
        if cnt2[fb]==1: cnt3[fb]=[a//m,a%m]

    q[fa]=fb # 将a加入到b的连通块中
    cnt[fb]+=1 # 更新b所在连通块的元素数量

for i in range(n):
    for j in range(m):
        if g[i][j]=='X': continue
        if i>0 and g[i-1][j]=='O': merge(i*m+j,(i-1)*m+j)
        if j>0 and g[i][j-1]=='O': merge(i*m+j,i*m+j-1)
# 所有边界只有一个的连通块的 [元素数量，连通块id]信息
ret=[]
for i in range(n):
    for j in range(m):
        # 获取到当前点的连通块id
        ind=find(i*m+j)
        if g[i][j]=='O' and ind==i*m+j:
            # 上面在合入到连通块中时，没有检查第一个元素是否是边界元素，此处进行检查
            # 如果是，同样更新连通块的边界元素的数量
            if check(ind//m,ind%m):  cnt2[ind]+=1
            # 如果连通块只有一个边界元素的话，加入到结果中
            if cnt2[ind]==1: ret.append([cnt[ind],ind])
ret.sort(reverse=True) # 按照连通块的元素数量降序排序
if len(ret)==0: print('NULL')
# 只有一个连通块或者有两个元素数量不同的，则取第一个作为答案
elif len(ret)==1 or ret[0][0]>ret[1][0]: 
    c,ind=ret[0]
    x,y=cnt3[ind]
    print(x,y,c)
# 有多个连通块，但是元素个数相同，则输出符合条件的连通块的数量
elif ret[0][0]==ret[1][0]:
    print(ret[0][0])
