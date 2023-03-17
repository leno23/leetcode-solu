'''总共有n个人在机房，每个人有一个标号，他们分成了多个团队，需要你根据收到的m条消息判定指定的两个人是否在一个团队中，具体的描述如下：
消息构成为：a b c，整数a、b分别代表了两个人的标号，整数c代表指令。
c==0代表a和b在同一个团队内。
c==1代表需要判定a和b的关系，如果a和b是一个团队，输出一行“we are a team”，如果不是，输出一行“we are not a team”
c为其他值，或当前行a或b超出1~n的范围，输出“da pian zi”

输入描述：
第一行包含两个整数n,m；分别表示有n个人和m条消息。（1 <= n,m <= 100000）
随后的m行，每行一条消息，消息格式为：a b c（1 <= a, b <= n，0 <= c <= 1）。
输出描述：
c==1时，根据a和b是否在一个团队中输出一行字符串，在一个团队中输出“we are a team”.不在同一个团队中输出“we are not a team”
c为其他值，或当前行a或b的标号小于1或者大于n时，输出字符串“da pian zi”
如果第一行n和m的值超出了约定的范围时，输出字符串“NULL”

示例1：
输入
5 7 
1 2 0
4 5 0 
2 3 0 
1 2 1 
2 3 1 
4 5 1 
1 5 1
输出
We are a team 
We are a team 
We are a team 
We are not a team
说明无

输入
5 6
1 2 0
1 2 1
1 5 0
2 3 1
2 5 1
1 3 2

输出
we are a team
we are not a team
we are a team
da pian zi

说明
第2行定义了1和2属同一个团队
第3行要求进行判断，输出“we are a team”
第4行定义了1和5是一个团队，自然2和5也就是同一个团队了。
第5行要求进行判定，输出“we are not a team”
第6行要求进行判定，输出“we are a team”
第7行c为其他值，输出“da pian zi”
'''
n,m=map(int,input().split())
q=[0]*(n+1)
for i in range(n+1): q[i]=i
def find(x):
    if q[x]!=x: q[x]=find(q[x])
    return q[x]
def merge(a,b):
    fa,fb=find(a),find(b)
    if fa==fb: return
    q[fa]=fb

for i in range(m):
    a,b,c=map(int,input().split())
    if a>n or b>n or c<0 or c>1: 
        print('da pian zi')
        continue
    if c==0:
        merge(a,b)
    if c==1:
        flag=find(a)==find(b)
        print(f'We are {""if flag else"not "}a team')


