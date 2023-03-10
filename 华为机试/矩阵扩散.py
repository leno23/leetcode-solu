n,mx=[int(x) for x in input().split()]
a=[int(x)for x in input().split()]

i,j,sm=0,0,0
ans=n+1
while 1:
    while j<n and sm<mx:
        sm += a[j]
        j+=1
    if sm<mx: break
    ans=min(ans,j-i)
    sm -=a[i]
    i+=1
print(ans)

'''
10 15
5 1 3 5 10 7 4 9 2 8
'''