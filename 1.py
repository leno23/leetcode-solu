n=int(input())
s=input()

c1,c2=0,0
for i in range(3):
    if s[i]=='G': c1+=1
    else: c2+=1
    i+=1
r=0
if c1==2 or c2==2: r+=1


i=0


while i+3 < n:
    if s[i]=='G': c1-=1
    else: c2-=1

    if s[i+3]=='G': c1+=1
    else: c2+=1

    if c1==2 or c2==2: r+=1

    i+=1
print(r)