s1=input()
s2=input()
v=int(input())
n=len(s1)
dif=[0]*n
for i in range(n):
    dif[i]=abs(ord(s1[i])-ord(s2[i]))
pre=[0]*(n+1)
for i in range(n): pre[i+1]=pre[i]+dif[i]
print(pre)
def sol():
    for i in range(n):
        for j in range(n+1,0,-1):
            if i+j<=n:
                if pre[i+j]-pre[i] <=v:
                    return j
print(sol())
    
