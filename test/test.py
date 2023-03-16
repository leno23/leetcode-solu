import bisect
c={}
c['2']=123
c[1]=4334
c[0]=99
print(c,[*c.keys()])
print(bisect.bisect_left([0,1],2))

grid=[[1,2,3],[4,5,6],[7,8,9]]
print(list(zip(*grid)))
# 0:{0:5,1:6}
# 1:{}

keys=[0,1]
l,r=0,len(keys)
while l<r:
    m=l+r>>1
    if keys[m]< 2:
        l=m+1
    else: r=m
print(l)

print([1,7].pop())

n,m=[int(x) for x in input().split()]
g=[]
for i in range(n):
    g.append(input().split())
q=[0]*(n*m)
for i in range(n*m): q[i]=i
cnt,cnt2,cnt3=[1]*(n*m),[0]*(n*m),{}
def find(x):
    if q[x]!=x: q[x]=find(q[x])
    return q[x]
def check(i,j):
    return i==n-1 or i==0 or j==0 or j==m-1
def merge(a,b):
    fa,fb=find(a),find(b)
    if fa==fb: return
    if check(a//m,a%m):
        cnt2[fb]+=1
        cnt3[fb]=[a//m,a%m]
    q[fa]=fb
    cnt[fb]+=1
for i in range(n):
    for j in range(m):
        if g[i][j]=='X':continue
        if i>0 and g[i-1][j]=='O':merge(i*m+j,(i-1)*m+j)
        if j>0 and g[i][j-1]=='O':merge(i*m+j,i*m+j-1)
ret=[]
for i in range(n):
    for j in range(m):
        ind=find(i*m+j)
        if g[i][j]=='O' and ind==i*m+j:
            if check(ind//m,ind%m):
                cnt2[ind]+=1
                cnt3[ind]=[ind//m,ind%m]
            if cnt2[ind]==1:
                ret.append([cnt[ind],ind])
ret.sort(reverse=True)
print(ret)
if len(ret)==0: print('NULL')
elif len(ret)==1 or ret[0][0]>ret[0][1]:
    c,ind=ret[0]
    x,y=cnt3[ind]
    print(x,y,c)
elif ret[0][0]==ret[1][0]:
    print(ret[0][0])