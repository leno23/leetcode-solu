s=input().split()
p=input()
n2,m=len(s),len(p)
print(s,p)
def check(s):
    n=len(s)
    f=[[0]*(m+1) for i in range(n+1)]
    f[0][0]=1
    for i in range(2,m+1,2):
        f[0][i]=p[i-1]=='*' and f[0][i-2]

    for i in range(1,n+1):
        for j in range(1,m+1):
            if p[j-1]=='*':
                if f[i][j-2]: f[i][j]=1
                elif f[i-1][j] and (s[i-1]==p[j-2] or p[j-2]=='.'): f[i][j]=1
            else:
                f[i][j]=f[i-1][j-1] and(s[i-1]==p[j-1] or p[j-1]=='.')
    return f[n][m]
r=[]
for i in range(n2):
    if check(s[i]): r.append(str(i))
print(','.join(r))