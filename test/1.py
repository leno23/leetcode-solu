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